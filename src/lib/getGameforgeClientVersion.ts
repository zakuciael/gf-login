import { GameforgeClientReleaseVersions, GameforgeClientVersion } from "../types";
import { InvalidResponseError } from "./errors";
import { getFileProperties } from "cfv";
import fetch from "node-fetch";

/**
 * @public
 */
export const getGameforgeClientVersion = (
    releaseVersion = GameforgeClientReleaseVersions.Final
): Promise<GameforgeClientVersion | undefined> => {
    // noinspection HttpUrlsUsage
    return fetch(`http://dl.tnt.gameforge.com/tnt/${releaseVersion}/gfclient.exe`, {
        method: "GET",
    })
        .then((res) => {
            if (res.ok) return res.buffer();
            else throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data) => getFileProperties(data))
        .then((props) => {
            const rawVersion = props.FileVersion as string;
            const match = rawVersion.match(
                /(\d{1,2}\.\d{1,2}\.\d{1,2}\.\d{1,5}) \(((?:\w+|-|_)+)@(\w+)\)/
            );

            return match != undefined
                ? { version: match[1], branch: match[2], commitId: match[3] }
                : undefined;
        });
};
