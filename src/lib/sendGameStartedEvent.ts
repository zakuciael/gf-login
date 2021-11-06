import { GameAccount, GameforgeClientVersion } from "../types";
import { CertificateStore } from "./utils/CertificateStore";
import dateFormat from "dateformat";
import { v4 as uuid } from "uuid";
import fetch from "node-fetch";
import { Agent } from "https";

/**
 * Sends a dummy "game started" event to the API
 * @public
 * @param installationId - The installation id
 * @param gameAccount - The game account object
 * @param clientVersion- The Gameforge Client version information
 * @param certificateStore - The certificate store loaded with Gameforge's certificate
 * @return Generated session id
 */
export const sendGameStartedEvent = (
    installationId: string,
    gameAccount: GameAccount,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore
): Promise<string> => {
    const sessionId = uuid();
    return fetch(`https://events2.gameforge.com/`, {
        method: "POST",
        agent: new Agent({
            pfx: certificateStore.fullCert,
            passphrase: certificateStore.password,
        }),
        headers: {
            "Content-Type": "application/json",
            "User-Agent": `GameforgeClient/${clientVersion.version
                .split(".")
                .slice(0, 3)
                .join(".")}`,
        },
        body: JSON.stringify({
            client_installation_id: installationId,
            client_locale: "usa_eng",
            client_session_id: uuid(),
            client_version_info: {
                branch: clientVersion.branch,
                commit_id: clientVersion.commitId,
                version: clientVersion.version,
            },
            id: 1,
            localtime: dateFormat(new Date(), "isoDateTime"),
            game_account_id: gameAccount.id,
            game_id: gameAccount.game.id,
            session_id: sessionId,
            start_option: "default_en-GB",
            type: "game_started",
        }),
    }).then(() => sessionId);
};
