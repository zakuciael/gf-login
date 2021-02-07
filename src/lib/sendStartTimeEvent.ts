import { GameforgeClientVersion } from "../types/GameforgeClientVersion";
import { CertificateAgent } from "./utils/certificates";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import fetch from "node-fetch";

export const sendStartTimeEvent = (
    installationId: string,
    clientVersion: GameforgeClientVersion
): Promise<void> => {
    return fetch(`https://events2.gameforge.com/`, {
        method: "POST",
        agent: CertificateAgent,
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
            localtime: DateTime.local().toFormat("yyyy-MM-dd'T'HH:mm:ssZZZ"),
            start_count: 1,
            start_time: 7000,
            type: "start_time",
        }),
    }).then(() => undefined);
};
