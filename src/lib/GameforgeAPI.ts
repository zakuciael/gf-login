import { GameAccount, GameforgeClientVersion } from "../types";
import { UnauthorizedError } from "./errors";
import { CertificateStore } from "./utils/CertificateStore";
import { v4 as uuid } from "uuid";
import { GfLang, GfLocale } from "../types/GfLocale";
import { getAccountToken } from "./GfAccount/getAccountToken";
import { getGameAccounts } from "./GfAccount/getGameAccounts";
import { getGameforgeClientVersion } from "./utils/getGameforgeClientVersion";
import { sendGameStartedEvent } from "./GfAccount/sendGameStartedEvent";
import { BlackBox } from "./utils/BlackBox";
import { getGameToken } from "./GfAccount/getGameToken";
import { sendIovation } from "./GfAccount/sendIovation";
import { Fingerprint } from "./utils/Fingerprint";
import { sendStartTimeEvent } from "./GfAccount/sendStartTimeEvent";

/**
 * Gameforge account class used to talk with API.
 *
 * @public
 */
export class GameforgeAPI {
    locale: GfLocale;
    gfLang: GfLang;
    installationId: string;
    authToken: string | null = null;
    fingerprint: Fingerprint;
    gameSessionId: string;
    clientVersion: GameforgeClientVersion | undefined = undefined;
    certStore: CertificateStore;

    constructor({
        locale,
        gfLang,
        installationId,
        fingerprint,
        certStore,
    }: {
        locale: GfLocale;
        gfLang: GfLang;
        installationId: string;
        fingerprint: Fingerprint;
        certStore: CertificateStore;
    }) {
        this.locale = locale;
        this.gfLang = gfLang;
        this.installationId = installationId;

        this.fingerprint = fingerprint;
        this.certStore = certStore;

        this.gameSessionId = uuid();
    }

    async authenthicate(email: string, password: string): Promise<boolean> {
	this.clientVersion = this.clientVersion ?? (await getGameforgeClientVersion())!;

        await sendStartTimeEvent(
            this.installationId,
            this.clientVersion,
            this.certStore,
            this.gameSessionId
        );
        try {
            this.authToken = await getAccountToken(email, password, this.installationId);
            return true;
        } catch (error) {
            this.authToken = null;
            return false;
        }
    }

    async getGameAccounts(): Promise<GameAccount[]> {
        if (this.authToken == null) {
            throw new UnauthorizedError();
        }
        return getGameAccounts(this.authToken, this.installationId);
    }

    async getGameToken(gameaccount: GameAccount): Promise<string> {
        if (this.authToken == null) {
            throw new UnauthorizedError();
        }
        if (this.clientVersion == null) {
            this.clientVersion = (await getGameforgeClientVersion()) as GameforgeClientVersion;
        }

        // send game started event
        await sendGameStartedEvent(
            this.installationId,
            gameaccount,
            this.clientVersion,
            this.certStore,
            this.gameSessionId
        );

        const blackbox = new BlackBox(gameaccount.id, this.gameSessionId, this.installationId);

        // sendIovation
        if (
            (await sendIovation(
                this.authToken,
                this.installationId,
                gameaccount,
                blackbox,
                this.fingerprint
            )) == false
        ) {
            throw new Error("sendIovation fail");
        }

        return getGameToken(
            this.authToken,
            gameaccount,
            this.installationId,
            this.clientVersion,
            this.certStore,
            blackbox,
            this.fingerprint
        );
    }
}
