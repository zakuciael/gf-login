import dateFormat from "dateformat";
import { Base64 } from "./Base64";
import { sha256 } from "./crypto";
import { Fingerprint } from "./Fingerprint";
import { randomIntFromRange, randomString } from "./strings";

/**
 * @public
 * Random generate new Fingerprint
 * Values are random generated and can be incorrect (can be detectable and you could be banned)
 */
export function generateRandomFingerprint(): Fingerprint {
    const randomStr = () => (Math.random() + 1).toString(36).substring(2);
    const vector = Base64.encode(randomString(112)).replace("=", "").replace("=", "");
    const fingerprintData = {
        v: 7,
        tz: "Europe/Warsaw",
        dnt: false,
        product: "Blink",
        osType: "Windows",
        app: "Chrome",
        vendor: "Google Inc.",
        cookies: true,
        mem: 8,
        con: 16,
        lang: "pl-PL,pl,en-US,en",
        plugins: sha256(randomStr()),
        gpu: "Google Inc.,ANGLE (NVIDIA GeForce RTX 3070 Ti Direct3D11 vs_5_0 ps_5_0)",
        fonts: sha256(randomStr()),
        audioC: sha256(randomStr()),
        analyser: sha256(randomStr()),
        width: 1920,
        height: 1080,
        depth: 24,
        lStore: true,
        sStore: true,
        video: sha256(randomStr()),
        audio: sha256(randomStr()),
        media: sha256(randomStr()),
        permissions: sha256(randomStr()),
        audioFP: randomIntFromRange(100, 500) + Math.random(),
        webglFP: sha256(randomStr()),
        canvasFP: randomIntFromRange(1000000000, 9999999999),
        dP: randomIntFromRange(1, 50),
        dF: randomIntFromRange(1, 50),
        dW: randomIntFromRange(1, 50),
        dC: randomIntFromRange(1, 50),
        creation: dateFormat(new Date(), "UTC:yyyy-mm-dd'T'HH:MM:ss'.'l'Z'"),
        uuid: randomString(27).toLowerCase(),
        d: 427,
        osVersion: "10",
        vector: vector,
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
        serverTimeInMS: dateFormat(new Date(), "UTC:yyyy-mm-dd'T'HH:MM:ss'.'l'Z'"),
        request: null,
    };
    const _fp = new Fingerprint(fingerprintData);
    _fp.shuffle();
    return _fp;
}
