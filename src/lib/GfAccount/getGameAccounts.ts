import { ForbiddenError, InvalidResponseError, UnauthorizedError } from "./../errors";
import type { GameAccount } from "../../types";
import fetch from "node-fetch";

interface RawGameAccount {
    id: string;
    clientId: string;
    gameId: string;
    gameEnvironmentId: string;
    userId: string;
    accountGroup: string;
    displayName: string;
    usernames: string[];
    created: string; // Date
    deleted: string | null; // Date
    preDeleted: string | null; // Date
    lastLogin: string | null; // Date
    accountNumericId: number;
    guls: { game: string; server: string; user: string; lang: string };
    wallet: {
        currencies: { amount: number; currencyId: string; locaKey: string }[];
    };
}

interface IAccountsResponse {
    [key: string]: RawGameAccount;
}

/**
 * Get game accounts associated with the Gameforge account
 * @public
 * @param authToken - The account's auth token
 * @param installationID - The installation id
 * @return An array of game accounts
 */
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
            if (res.ok) return res.json() as Promise<IAccountsResponse>;
            else if (res.status === 401) throw new UnauthorizedError();
            else if (res.status === 403) throw new ForbiddenError();
            else throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data: IAccountsResponse) =>
            Object.values(data).map((acc) => ({
                id: acc.id,
                accountName: acc.displayName,
                usernames: acc.usernames,
                game: {
                    id: acc.gameId,
                    name: acc.guls.game,
                },
            }))
        );
};
