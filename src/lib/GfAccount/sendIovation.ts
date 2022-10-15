import type { GameAccount } from "../../types";
import fetch from "node-fetch";
import { BlackBox } from "./../utils/BlackBox";
import { Fingerprint } from "../utils/Fingerprint";

interface IApiResponse {
    status: string;
}

const browser_user_agent =
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36";
/**
 * Sends Iovation to the API
 * @public
 * @param authToken - Auth token
 * @param installationId - The installation id
 * @param gameAccount - Your Game account (gameforge sub account)
 * @param blackbox - Your Blackbox
 * @param fingerprint - Your Fingerprint
 */
export const sendIovation = async (
    authToken: string,
    installationId: string,
    gameAccount: GameAccount,
    blackbox: BlackBox,
    fingerprint: Fingerprint
): Promise<boolean> => {
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
            blackbox: blackbox.fingerprintToEncodedBlackbox(fingerprint.fingerprint),
            type: "play_now",
        }),
    }).then(async (res) => {
        if (!res.ok) {
            return false;
        }
        const data = (await res.json()) as IApiResponse;
        if (data.status != "ok") {
            return false;
        }
        return true;
    });
};
