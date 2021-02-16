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

    constructor(fullCertPath: string, certPassword: string, hashCertPath: string) {
        this._fullCert = fs.readFileSync(path.resolve(fullCertPath));
        this._hashCert = fixHashCertificate(fs.readFileSync(path.resolve(hashCertPath)));
        this._password = certPassword;
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
