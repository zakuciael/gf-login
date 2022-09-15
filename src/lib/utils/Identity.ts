import fs from "fs/promises";
import path from "path";
import untildify from "untildify";
import { IFingerprint, IFingerprintRequest } from "../../types";
import { Fingerprint } from "./Fingerprint";

/**
 * Used to load Fingerprint
 *
 * @public
 */
export class Identity {
    private _fingerprint: Fingerprint | null = null;
    private _filepath: string | null = null;

    // Load identity from json file
    public async load(filePath: string): Promise<Fingerprint> {
        this._filepath = path.resolve(untildify(path.normalize(filePath)));

        const txt = await (await fs.readFile(this._filepath)).toString();
        const data = JSON.parse(txt);

        this._fingerprint = new Fingerprint(data);
        this.update();
        return this._fingerprint;
    }

    // overwrite request data in fingerprint
    public setRequest(data: IFingerprintRequest): void {
        if (this._fingerprint == null) throw new Error("use load() first!");

        this._fingerprint.setRequest(data);
    }

    // shuffle data in fingerprint
    public async update(): Promise<void> {
        if (this._fingerprint == null) throw new Error("use load() first!");

        await this._fingerprint.shuffle();
    }

    /**
     * @return Fingerprint json object
     */
    public get fingerprint(): IFingerprint {
        if (this._fingerprint == null) throw new Error("use load() first!");

        return this._fingerprint.fingerprint;
    }

    public async save(): Promise<void> {
        if (this._fingerprint == null) throw new Error("use load() first!");
        if (this._filepath == null) throw new Error("use load() first!");

        await fs.writeFile(this._filepath, JSON.stringify(this._fingerprint.fingerprint));
    }
}
