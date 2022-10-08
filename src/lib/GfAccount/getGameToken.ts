import { ForbiddenError, InvalidResponseError, UnauthorizedError } from "./../errors";
import type { GameAccount, GameforgeClientVersion } from "../../types";
import { createAccountHash } from "./../utils/createAccountHash";
import { CertificateStore } from "./../utils/CertificateStore";
import fetch from "node-fetch";
import { BlackBox } from "../utils/BlackBox";
import { Identity } from "../utils/Identity";

interface IApiResponse {
    code: string;
}

/**
 * Authenticate to the game using Gameforge account
 * @public
 * @param authToken - The account's auth token
 * @param gameAccount - The game account object
 * @param installationID - The installation id
 * @param clientVersion - The Gameforge Client version information
 * @param certificateStore - The certificate store loaded with Gameforge's certificate
 * @param blackbox - Blackbox
 * @param identity - Identity
 * @return The game token
 */
export const getGameToken = async (
    authToken: string,
    gameAccount: GameAccount,
    installationId: string,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore,
    blackbox: BlackBox,
    identity: Identity
): Promise<string> => {
    return fetch(`https://spark.gameforge.com/api/v1/auth/thin/codes`, {
        method: "POST",
        headers: {
            "User-Agent": `Chrome/C${clientVersion.version} (${createAccountHash(
                gameAccount.id,
                installationId,
                clientVersion,
                certificateStore
            )})`,
            "TNT-Installation-Id": installationId,
            Origin: "spark://www.gameforge.com",
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Connection: "Keep-Alive",
        },
        body: JSON.stringify({
            platformGameAccountId: gameAccount.id,
            blackbox: blackbox.encrypted(identity),
            gsid: blackbox.gsid,
            gameid: gameAccount.game.id,
        }),
    })
        .then((res) => {
            if (res.ok) return res.json() as Promise<IApiResponse>;
            else if (res.status === 403) throw new ForbiddenError();
            else if (res.status === 401) throw new UnauthorizedError();
            else throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data: { code: string }) => data.code);
};
