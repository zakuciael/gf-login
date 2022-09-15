import { IFingerprint } from "../../types";
import { fingerprintNoQuotes } from "../../types/Fingerprint";

export function fixFingerprintDataTypes(fingerprint: IFingerprint): IFingerprint {
    const newFp = (fingerprint as unknown) as Record<string, unknown>;

    // set correct data types (int are intigers, bool are booleans)
    Object.entries(fingerprint).forEach(([key, value]) => {
        if (value == null || value == "null") {
            newFp[key] = null;
        } else if (fingerprintNoQuotes.includes(key) && value.toLowerCase !== undefined) {
            if (value.toLowerCase() == "false") {
                newFp[key] = false;
            } else if (value.toLowerCase() == "true") {
                newFp[key] = true;
            } else if (value.includes(".")) {
                newFp[key] = parseFloat(value);
            } else {
                newFp[key] = parseInt(value);
            }
        }
    });
    return (newFp as unknown) as IFingerprint;
}
