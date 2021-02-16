import { asn1, pkcs12, pki, util } from "node-forge";
import path from "path";
import fs from "fs";

const fixHashCertificate = (cert: Buffer) => {
    const temp = Buffer.from(cert.toString().replace(/\r\n|\r|\n/g, "\n"));
    return temp[temp.length - 1] !== 0x0a ? Buffer.concat([temp, Buffer.from([0x0a])]) : temp;
};

export class CertificateStore {
    private readonly _fullCert: Buffer;
    private readonly _hashCert: Buffer;
    private readonly _password: string;

    constructor(filePath: string, password: string) {
        this._fullCert = fs.readFileSync(path.resolve(filePath));
        this._password = password;

        const pkcs12Cert = pkcs12.pkcs12FromAsn1(
            asn1.fromDer(util.decode64(this._fullCert.toString("base64"))),
            this._password
        );

        const certBags = pkcs12Cert.getBags({ bagType: pki.oids.certBag })[pki.oids.certBag];

        if (certBags == undefined || certBags.length < 1)
            throw new Error("Invalid certificate provided, no cert bags found.");

        const firstCert = certBags[0];
        if (firstCert.cert == undefined)
            throw new Error("Invalid certificate provided, no public certificates found.");

        this._hashCert = fixHashCertificate(Buffer.from(pki.certificateToPem(firstCert.cert)));
    }

    get fullCert(): Buffer {
        return this._fullCert;
    }

    get hashCert(): Buffer {
        return this._hashCert;
    }

    get password(): string {
        return this._password;
    }
}
