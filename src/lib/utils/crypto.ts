import { CharType } from "../../types/CharType";
import { createHash } from "crypto";

const hash = (data: Buffer | string, algorithm: string, upper: boolean): string => {
    const hash = createHash(algorithm).update(data).digest("hex");
    return upper ? hash.toUpperCase() : hash;
};

export const sha1 = (data: Buffer | string, upper = false): string => {
    return hash(data, "sha1", upper);
};

export const sha256 = (data: Buffer | string, upper = false): string => {
    return hash(data, "sha256", upper);
};
