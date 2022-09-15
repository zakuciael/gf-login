import { asn1, pem, pkcs12, pki, util } from "node-forge";
import path from "path";
import fs from "fs";
import { Agent } from "https";

const fixHashCertificate = (cert: Buffer) => {
    const temp = Buffer.from(cert.toString().replace(/\r\n|\r|\n/g, "\n"));
    return temp[temp.length - 1] !== 0x0a ? Buffer.concat([temp, Buffer.from([0x0a])]) : temp;
};

/**
 * CertificateStore class is used to setup .pem or .p12 certificate file exported from gfclient.exe
 *
 * @public
 */
export class CertificateStore {
    private readonly _hashCert: Buffer;
    private readonly _agent: Agent;

    constructor(agent: Agent, hashCert: Buffer) {
        this._hashCert = hashCert;
        this._agent = agent;
    }

    public static create(filePath: string, password: string): CertificateStore {
        const fullCert = fs.readFileSync(path.resolve(filePath));

        const pkcs12Cert = pkcs12.pkcs12FromAsn1(
            asn1.fromDer(util.decode64(fullCert.toString("base64"))),
            password
        );

        const certBags = pkcs12Cert.getBags({ bagType: pki.oids.certBag })[pki.oids.certBag];

        if (certBags == undefined || certBags.length < 1)
            throw new Error("Invalid certificate provided, no cert bags found.");

        const firstCert = certBags[0];
        if (firstCert.cert == undefined)
            throw new Error("Invalid certificate provided, no public certificates found.");

        const hashCert = fixHashCertificate(Buffer.from(pki.certificateToPem(firstCert.cert)));
        const agent = new Agent({
            pfx: fullCert,
            passphrase: password,
        });
        return new CertificateStore(agent, hashCert);
    }

    public static createFromPem(filePath: string): CertificateStore {
        const fullPemCert = fs.readFileSync(path.resolve(filePath));

        const pemCert = pem.decode(fullPemCert.toString());
        const firstCert = pemCert.find((a) => a.type == "CERTIFICATE");
        if (firstCert == undefined)
            throw new Error("Invalid certificate provided, no public certificates found.");

        const privateKey = pemCert.find((a) => a.type == "PRIVATE KEY");
        if (privateKey == undefined)
            throw new Error("Invalid certificate provided, no private key found.");

        const certBody = pem.encode(firstCert);
        const privateBody = pem.encode(privateKey);

        const hashCert = fixHashCertificate(Buffer.from(certBody));
        const agent = new Agent({
            cert: certBody,
            key: privateBody,
            rejectUnauthorized: false,
        });
        return new CertificateStore(agent, hashCert);
    }

    get hashCert(): Buffer {
        return this._hashCert;
    }

    get agent(): Agent {
        return this._agent;
    }
}
