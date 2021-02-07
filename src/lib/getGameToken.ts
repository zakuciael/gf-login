import { ForbiddenError, InvalidResponseError, UnauthorizedError } from "./errors";
import { createAccountHash } from "./utils/createAccountHash";
import { sendStartTimeEvent } from "./sendStartTimeEvent";
import { GameforgeClientVersion } from "../types";
import fetch from "node-fetch";

export const getGameToken = async (
    authToken: string,
    accountID: string,
    installationID: string,
    clientVersion: GameforgeClientVersion
): Promise<string> => {
    await sendStartTimeEvent(installationID, clientVersion);
    return fetch(`https://spark.gameforge.com/api/v1/auth/thin/codes`, {
        method: "POST",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
            "TNT-Installation-Id": installationID,
            "User-Agent": `Chrome/C${clientVersion.version} (${createAccountHash(
                accountID,
                installationID,
                clientVersion
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
