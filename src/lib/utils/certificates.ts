import { Agent } from "https";
import path from "path";
import fs from "fs";

export const hashCertificate = fs.readFileSync(path.resolve("certs/hash.pem"));

export const CertificateAgent = new Agent({
    pfx: fs.readFileSync(path.resolve("certs/full.p12")),
    passphrase: "WTjXEnSGpj49Ba44",
});
