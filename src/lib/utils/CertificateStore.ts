import path from "path";
import fs from "fs";

export class CertificateStore {
    private readonly _fullCert: Buffer;
    private readonly _hashCert: Buffer;
    private readonly _password: string;

    constructor(fullCertPath: string, certPassword: string, hashCertPath: string) {
        this._fullCert = fs.readFileSync(path.resolve(fullCertPath));
        this._hashCert = Buffer.from(
            fs
                .readFileSync(path.resolve(hashCertPath))
                .toString()
                .replace(/\r\n|\r|\n/g, "\n")
        );
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
