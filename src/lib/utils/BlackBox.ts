import { IFingerprint } from "../../types";
import { BLACKBOX_FIELDS } from "../../types/Blackbox";
import { IFingerprintRequest } from "../../types/Fingerprint";
import { Base64 } from "./Base64";
import { Fingerprint } from "./Fingerprint";
import { fixFingerprintDataTypes } from "./fixFingerprintDataTypes";
import { sha512 } from "./sha512";
import { randomIntFromRange } from "./strings";

function toPercentEncoding(str: string, exclude: string): string {
    return str
        .split("")
        .map((v) => {
            if (exclude.includes(v)) {
                return v;
            }
            return encodeURIComponent(v);
        })
        .join("");
}

/**
 * Blackbox class used to create encrypted value used during game token obtain
 *
 * @public
 */
export class BlackBox {
    accountId: string;
    gsid: string;
    installationId: string;
    key: string;

    constructor(accountId: string, gameSessionId: string, installationId: string) {
        this.accountId = accountId;
        this.gsid = `${gameSessionId}-${randomIntFromRange(1000, 9999)}`;
        this.installationId = installationId;

        // generate key
        this.key = sha512(`${this.gsid}-${accountId}`);
    }

    public encrypted(fingerprint: Fingerprint): string {
        fingerprint.setRequest(this.createRequest());
        const blackbox = this.fingerprintToEncodedBlackbox(fingerprint.fingerprint);

        const encryptedBlackbox = this.encrypt(blackbox);
        return Base64.encode(encryptedBlackbox);
    }

    public encrypt(blackbox: string): string {
        const result: string[] = [];
        const key = this.key;
        for (let i = 0; i < blackbox.length; i++) {
            const byte = blackbox[i];
            const key_idx = i % key.length;

            const c =
                byte.charCodeAt(0) ^
                key[key_idx].charCodeAt(0) ^
                key[key.length - key_idx - 1].charCodeAt(0);
            result.push(String.fromCharCode(c));
        }
        return result.join("");
    }

    public fingerprintToEncodedBlackbox(dictObj: IFingerprint): string {
        const jsonObj = BlackBox.generateCorrectBlackbox(dictObj);
        const uriEncoded = toPercentEncoding(jsonObj, "-_!~*.'()");

        const result = [uriEncoded[0]];
        for (let i = 1; i < uriEncoded.length; i++) {
            const b = result[i - 1].charCodeAt(0);
            const a = uriEncoded[i].charCodeAt(0);
            const c = (a + b) % 256;
            result.push(String.fromCharCode(c));
        }

        let h = Base64.urlSafeEncode(result.join(""));

        // remove all = at the end of string
        h = h.replace(/\s+$/gm, "=");

        const blackbox = "tra:" + h;
        return blackbox;
    }

    public static generateCorrectBlackbox(dictObj: IFingerprint): string {
        // Change dict to list
        dictObj = fixFingerprintDataTypes(dictObj); // remove `"` from specific data
        const blackbox: unknown[] = [];
        // Make sure the order of elements are correct
        BLACKBOX_FIELDS.forEach((field) => {
            blackbox.push(dictObj[field]);
        });
        return JSON.stringify(blackbox);
    }

    private createRequest(): IFingerprintRequest {
        const gsidSplited = this.gsid.split("-");
        const x = {
            features: [randomIntFromRange(1, 2 ** 32)],
            installation: this.installationId,
            session: gsidSplited[gsidSplited.length - 1],
        };
        return x;
    }
}
