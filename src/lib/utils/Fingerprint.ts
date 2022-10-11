import { IFingerprint, IFingerprintRequest } from "../../types";
import dateFormat from "dateformat";
import fetch from "node-fetch";
import { Base64 } from "./Base64";
import { randomIntFromRange, randomString } from "./strings";
import { fixFingerprintDataTypes } from "./fixFingerprintDataTypes";
import { resolve as pathResolve, normalize as pathNormalize } from "path";
import untildify from "untildify";
import { readFileSync } from "fs";
import { FingerprintSchema } from "../schema/fingerprintSchema";

const SERVER_FILE_GAME1_FILE = "https://gameforge.com/tra/game1.js";

async function getServerDate(): Promise<string> {
    // Get server date
    return fetch(SERVER_FILE_GAME1_FILE).then((res) => {
        const dateStr = res.headers.get("Date")?.replace("GMT", "UTC");
        const dt = dateStr ? new Date(dateStr) : new Date();
        return dateFormat(dt, "UTC:yyyy-mm-dd'T'HH:MM:ss'.'l'Z'");
    });
}

/**
 * Your devce Fingerprint. That class is used to shuffle data in that fingerprint.
 *
 * @public
 */
export class Fingerprint {
    fingerprint: IFingerprint;
    constructor(fp: IFingerprint) {
        this.fingerprint = fp;
        this.fingerprint.request = null;
        this.fingerprint = fixFingerprintDataTypes(this.fingerprint);
    }

    public static fromFile(filePath: string): Fingerprint {
        const filepath = pathResolve(untildify(pathNormalize(filePath)));

        // load fingerprint from file
        const txt = readFileSync(filepath).toString();
        const fpdata = JSON.parse(txt);
        FingerprintSchema.parse(fpdata);
        const _fingerprint = new Fingerprint(fpdata);
        _fingerprint.shuffle();
        return _fingerprint;
    }

    async shuffle(): Promise<void> {
        this.updateTimings();
        this.updateCreation();
        await this.updateServerTime();
        this.updateVector();
    }

    updateTimings(): void {
        this.fingerprint.dP = randomIntFromRange(0, 50 - 1);
        this.fingerprint.dF = randomIntFromRange(0, 50 - 1);
        this.fingerprint.dW = randomIntFromRange(0, 50 - 1);
        this.fingerprint.dC = randomIntFromRange(0, 50 - 1);
        this.fingerprint.d =
            this.fingerprint.dP +
            this.fingerprint.dF +
            this.fingerprint.dW +
            this.fingerprint.dC +
            randomIntFromRange(0, 10 - 1);
    }

    updateCreation(): void {
        this.fingerprint.creation = dateFormat(new Date(), "UTC:yyyy-mm-dd'T'HH:MM:ss'.'l'Z'"); // "2022-09-09T15:01:51.802Z"
    }

    async updateServerTime(): Promise<void> {
        this.fingerprint.serverTimeInMS = await getServerDate(); // "2022-09-09T15:01:52.000Z"
    }

    updateVector(): void {
        let c = Base64.encode(`${new Date().getTime()}`);
        c = c.replace("=", "");
        c = c.replace("=", "");
        c = c.replace("=", "");
        this.fingerprint.vector = c;
    }

    generateVector(): string {
        const str = randomString(99);
        const t = new Date().getTime();
        return Base64.encode(`${str} ${t}`);
    }

    setRequest(data: IFingerprintRequest): void {
        this.fingerprint.request = data;
    }

    toString(): string {
        return JSON.stringify(this.fingerprint);
    }
}
