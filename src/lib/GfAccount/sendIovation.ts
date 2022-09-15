import type { GameAccount } from "../../types";
import fetch from "node-fetch";
import { BlackBox } from "./../utils/BlackBox";
import { Identity } from "./../utils/Identity";
import { randomIntFromInterval } from "./../utils/strings";

const browser_user_agent =
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36";
/**
 * Sends Iovation to the API
 * @public
 * @param authToken - Auth token
 * @param installationId - The installation id
 * @param gameAccount - Your Game account (gameforge sub account)
 * @param gameSessionId- uuid generated on GfAccount init
 * @param identity - Your Identity
 */
export const sendIovation = async (
    authToken: string,
    installationId: string,
    gameAccount: GameAccount,
    gameSessionId: string,
    identity: Identity
): Promise<boolean> => {
    throw Error("not used");
    const blackbox = new BlackBox(
        gameAccount.id,
        `${gameSessionId}-${randomIntFromInterval(1000, 9999)}`,
        installationId
    );

    return fetch("https://spark.gameforge.com/api/v1/auth/iovation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": browser_user_agent,
            "TNT-Installation-Id": installationId,
            Origin: "spark://www.gameforge.com",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            accountId: gameAccount.id,
            blackbox: blackbox.fingerprintToEncodedBlackbox(identity.fingerprint),
            type: "play_now",
        }),
    }).then(async (res) => {
        if (!res.ok) {
            console.warn(`sendIovation (httpstatus=${res.status})`);
            return false;
        }
        const data = await res.json();
        if (data.status != "ok") {
            console.warn(`sendIovation nie ok`);
            return false;
        }
        return true;
    });
};