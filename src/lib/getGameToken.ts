import { ForbiddenError, InvalidResponseError, UnauthorizedError } from "./errors";
import type { GameAccount, GameforgeClientVersion } from "../types";
import { createAccountHash } from "./utils/createAccountHash";
import { sendGameStartedEvent } from "./sendGameStartedEvent";
import { CertificateStore } from "./utils/CertificateStore";
import fetch from "node-fetch";

/**
 * Authenticate to the game using Gameforge account
 * @public
 * @param authToken - The account's auth token
 * @param gameAccount - The game account object
 * @param installationID - The installation id
 * @param clientVersion - The Gameforge Client version information
 * @param certificateStore - The certificate store loaded with Gameforge's certificate
 * @return The game token
 */
export const getGameToken = async (
    authToken: string,
    gameAccount: GameAccount,
    installationID: string,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore
): Promise<string> => {
    const sessionId = await sendGameStartedEvent(
        installationID,
        gameAccount,
        clientVersion,
        certificateStore
    );

    return fetch(`https://spark.gameforge.com/api/v1/auth/thin/codes`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "TNT-Installation-Id": installationID,
            "User-Agent": `Chrome/C${clientVersion.version} (${createAccountHash(
                gameAccount.id,
                installationID,
                clientVersion,
                certificateStore
            )})`,
        },
        body: JSON.stringify({
            gsid: `${sessionId}-${Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000}`,
            platformGameAccountId: gameAccount.id,
        }),
    })
        .then((res) => {
            if (res.ok) return res.json() as Promise<{ code: string }>;
            else if (res.status === 403) throw new ForbiddenError();
            else if (res.status === 401) throw new UnauthorizedError();

            throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data) => data.code);
};
