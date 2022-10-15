/**
 * Part of IFingerprint. Represents request part of fingerprint
 * @public
 */
export interface IFingerprintRequest {
    features: number[];
    installation: string;
    session: string;
}

/**
 * Represents your device fingerprint
 * @public
 */
export interface IFingerprint {
    analyser: string;
    app: string;
    audio: string;
    audioC: string;
    audioFP: number;
    canvasFP: number;
    con: number;
    cookies: boolean;
    creation: string;
    d: number;
    dC: number;
    dF: number;
    dP: number;
    dW: number;
    depth: number;
    dnt: boolean;
    fonts: string;
    gpu: string;
    height: number;
    lStore: boolean;
    lang: string;
    media: string;
    mem: number;
    osType: string;
    osVersion: string;
    permissions: string;
    plugins: string;
    product: string;
    request: IFingerprintRequest | null;
    sStore: boolean;
    serverTimeInMS: string;
    tz: string;
    userAgent: string;
    uuid: string;
    v: number;
    vector: string;
    vendor: string;
    video: string;
    webglFP: string;
    width: number;
}

// list of fingerprint elements with dont have `"` (they are numbers or booleans)
export const fingerprintNoQuotes = [
    "audioFP",
    "canvasFP",
    "con",
    "cookies",
    "d",
    "dC",
    "dF",
    "dP",
    "dW",
    "depth",
    "dnt",
    "height",
    "lStore",
    "mem",
    "sStore",
    "v",
    "width",
];
