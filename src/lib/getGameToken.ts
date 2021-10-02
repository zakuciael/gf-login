import { ForbiddenError, InvalidResponseError, UnauthorizedError } from "./errors";
import { createAccountHash } from "./utils/createAccountHash";
import { CertificateStore } from "./utils/CertificateStore";
import { sendStartTimeEvent } from "./sendStartTimeEvent";
import type { GameforgeClientVersion } from "../types";
import fetch from "node-fetch";

/**
 * Authenticate to the game using Gameforge account
 * @public
 * @param authToken - The account's auth token
 * @param accountID - The game account id
 * @param installationID - The installation id
 * @param clientVersion - The Gameforge Client version information
 * @param certificateStore - The certificate store loaded with Gameforge's certificate
 * @return The game token
 */
export const getGameToken = async (
    authToken: string,
    accountID: string,
    installationID: string,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore
): Promise<string> => {
    await sendStartTimeEvent(installationID, clientVersion, certificateStore);
    return fetch(`https://spark.gameforge.com/api/v1/auth/thin/codes`, {
        method: "POST",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
            "TNT-Installation-Id": installationID,
            "User-Agent": `Chrome/C${clientVersion.version} (${createAccountHash(
                accountID,
                installationID,
                clientVersion,
                certificateStore
            )}) GameforgeClient/${clientVersion.version.split(".").slice(0, 3).join(".")}`,
        },
        body: JSON.stringify({
            platformGameAccountId: accountID,
        }),
    })
        .then((res) => {
            if (res.ok) return res.json();
            else if (res.status === 403) throw new ForbiddenError();
            else if (res.status === 401) throw new UnauthorizedError();
            else throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data: { code: string }) => data.code);
};
