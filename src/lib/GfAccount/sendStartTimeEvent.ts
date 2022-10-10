import { CertificateStore } from "./../utils/CertificateStore";
import type { GameforgeClientVersion } from "../../types";
import dateFormat from "dateformat";
import fetch from "node-fetch";

/**
 * Sends a dummy "start time" event to the API
 * @public
 * @param installationId - The installation id
 * @param clientVersion - The Gameforge Client version information
 * @param certificateStore - The certificate store loaded with Gameforge's certificate
 * @param gameSessionId - UUID generated on start
 */
export const sendStartTimeEvent = async (
    installationId: string,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore,
    gameSessionId: string
): Promise<void> => {
    await fetch(`https://events.gameforge.com/`, {
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
            client_locale: "usa_eng",
            client_session_id: gameSessionId,
            client_version_info: {
                branch: clientVersion.branch,
                commit_id: clientVersion.commitId,
                version: clientVersion.version,
            },
            id: 0,
            localtime: dateFormat(new Date(), "isoDateTime"),
            start_count: 1,
            start_time: 7000,
            type: "start_time",
        }),
    });
};
