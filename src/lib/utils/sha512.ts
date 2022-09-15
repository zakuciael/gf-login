import crypto from "crypto";

export const sha512 = (text: string): string => {
    const hash = crypto.createHash("sha512");
    const data = hash.update(text, "utf8");
    return data.digest("hex");
};
