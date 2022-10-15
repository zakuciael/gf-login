import { GameAccount, GameforgeClientVersion } from "../../types";
import { CertificateStore } from "./../utils/CertificateStore";
import dateFormat from "dateformat";
import fetch from "node-fetch";

/**
 * Sends a dummy "game started" event to the API
 * @public
 * @param installationId - The installation id
 * @param gameAccount - The game account object
 * @param clientVersion- The Gameforge Client version information
 * @param certificateStore - The certificate store loaded with Gameforge's certificate
 * @param gameSessionId - UUID generated on start
 */
export const sendGameStartedEvent = async (
    installationId: string,
    gameAccount: GameAccount,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore,
    gameSessionId: string
): Promise<void> => {
    await fetch(`https://events2.gameforge.com/`, {
        method: "POST",
        agent: certificateStore.agent,

        headers: {
            "Content-Type": "application/json",
            "User-Agent": `GameforgeClient/${clientVersion.version
                .split(".")
                .slice(0, 3)
                .join(".")}`,
        },
        body: JSON.stringify({
            client_installation_id: installationId,
            client_locale: "usa_eng", // pol_pol
            client_session_id: gameSessionId,
            client_version_info: {
                branch: clientVersion.branch,
                commit_id: clientVersion.commitId, // python version have here "d7a4e7bb)"
                version: clientVersion.version,
            },
            id: 1,
            localtime: dateFormat(new Date(), "isoDateTime"),
            game_account_id: gameAccount.id,
            game_id: gameAccount.game.id,
            session_id: gameSessionId,
            start_option: "default_en-GB", // default_pl-PL
            type: "game_started",
        }),
    });
};
