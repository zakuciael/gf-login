import { spawn as cpspawn } from "child_process";
import fs from "fs/promises";
import which from "which";
import path from "path";

const fixHashCertificate = (cert: Buffer) => {
    const temp = Buffer.from(cert.toString().replace(/\r\n|\r|\n/g, "\n"));
    return temp[temp.length - 1] !== 0x0a ? Buffer.concat([temp, Buffer.from([0x0a])]) : temp;
};

/**
 * Represents OpenSSL options passed to {@link CertificateStore.create} method.
 * @public
 */
export interface CreateCertificateStoreOptions {
    /**
     * Path to the `openssl` executable
     * @default Resolved from the `$PATH` env.
     */
    opensslPath?: string;
}

export class CertificateStore {
    private readonly _fullCert: Buffer;
    private readonly _hashCert: Buffer;
    private readonly _password: string;

    /**
     * @param fullCert - Encrypted .p12 certificate
     * @param hashCert - Decrypted CA certificate
     * @param password - Certificate password
     */
    constructor(fullCert: Buffer, hashCert: Buffer, password: string) {
        this._password = password;
        this._fullCert = fullCert;
        this._hashCert = hashCert;
    }

    /**
     * Creates {@link CertificateStore} by reading .p12 certificate from the file system
     * @param filePath - Path to the .p12 certificate
     * @param password - Certificate password
     * @param options - OpenSSL options
     * @return {@link CertificateStore} created with the contents of the .p12 certificate
     */
    public static async create(
        filePath: string,
        password: string,
        options?: CreateCertificateStoreOptions
    ): Promise<CertificateStore> {
        filePath = path.resolve(filePath);
        options = options ?? {};

        const fullCert = await fs.readFile(filePath);
        const hashCert = await CertificateStore.readHashCert(
            filePath,
            password,
            options.opensslPath ?? "openssl"
        );

        return new CertificateStore(fullCert, fixHashCertificate(hashCert), password);
    }

    private static async readHashCert(
        filePath: string,
        password: string,
        opensslPath = "openssl"
    ): Promise<Buffer> {
        const start = "-----BEGIN CERTIFICATE-----";
        const end = "-----END CERTIFICATE-----";
        const { stdout } = await CertificateStore.spawn(opensslPath, [
            "pkcs12",
            `-in`,
            filePath,
            `-passin`,
            `pass:${password}`,
            `-nodes`,
        ]);

        if (!stdout)
            throw new Error(
                "Unable to read certificate, no output was received from the openssl command"
            );

        const startOffset = stdout.indexOf(start);
        const endOffset = stdout.indexOf(end);
        if (startOffset === -1 || endOffset === -1)
            throw new Error(
                "Unable to read certificate, specified file doesn't contain an valid certificate"
            );

        return Buffer.from(stdout.substring(startOffset, endOffset + end.length));
    }

    private static async spawn(
        command: string,
        params: string[]
    ): Promise<{ code: number | null; stdout: string; stderr: string }> {
        await which(command).catch(
            () => new Error(`Could not find openssl on your system on this path: ${command}`)
        );

        return new Promise((resolve, reject) => {
            let stdout = "";
            let stderr = "";

            const openssl = cpspawn(command, params);

            openssl.stdout.on("data", (data: Buffer) => {
                stdout += data.toString("binary");
            });

            openssl.stderr.on("data", (data: Buffer) => {
                stderr += data.toString("binary");
            });

            let finished = false;
            let neededCloses = 2;
            let code: number | null = -1;

            const done = (err?: Error): void => {
                if (finished) return;

                if (err) {
                    finished = true;
                    return reject(err);
                }

                if (--neededCloses < 1) {
                    finished = true;

                    if (code) {
                        if (
                            code === 2 &&
                            (stderr === "" || /depth lookup: unable to/.test(stderr))
                        ) {
                            return resolve({ code, stdout, stderr });
                        }

                        return reject(
                            new Error(
                                "Invalid openssl exit code: " +
                                    code +
                                    "\n% openssl " +
                                    params.join(" ") +
                                    "\n" +
                                    stderr
                            )
                        );
                    } else {
                        return resolve({ code, stdout, stderr });
                    }
                }
            };

            openssl.on("error", (err) => done(err));

            openssl.on("exit", (ret) => {
                code = ret;
                done();
            });

            openssl.on("close", () => {
                stdout = Buffer.from(stdout, "binary").toString("utf-8");
                stderr = Buffer.from(stderr, "binary").toString("utf-8");
                done();
            });
        });
    }

    /**
     * @return Encrypted .p12 certificate
     */
    get fullCert(): Buffer {
        return this._fullCert;
    }

    /**
     * @return Decrypted CA certificate
     */
    get hashCert(): Buffer {
        return this._hashCert;
    }

    /**
     * @return Certificate password
     */
    get password(): string {
        return this._password;
    }
}
