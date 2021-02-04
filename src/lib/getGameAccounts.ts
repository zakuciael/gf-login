import { InvalidResponseError, UnauthorizedError } from "./errors";
import { GameAccount, RawGameAccount } from "../types/GameAccount";
import fetch from "node-fetch";

export const getGameAccounts = (
    authToken: string,
    installationID: string
): Promise<GameAccount[]> => {
    return fetch("https://spark.gameforge.com/api/v1/user/accounts", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`,
            "TNT-Installation-Id": installationID,
        },
    })
        .then((res) => {
            if (res.ok) return res.json();
            else if (res.status === 403) throw new UnauthorizedError();
            else throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data: { [key: string]: RawGameAccount }) =>
            Object.values(data).map((acc) => ({
                id: acc.id,
                accountName: acc.displayName,
                usernames: acc.usernames,
                game: acc.guls.game,
            }))
        );
};
