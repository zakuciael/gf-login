interface RawGameInfo {
    game: string;
    server: string;
    user: string;
    lang: string;
}

interface RawCurrency {
    amount: number;
    currencyId: string;
    locaKey: string;
}

export interface RawGameAccount {
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
    guls: RawGameInfo;
    wallet: { currencies: RawCurrency[] };
}

export interface GameInfo {
    id: string;
    name: string;
}

export interface GameAccount {
    id: string;
    accountName: string;
    usernames: string[];
    game: GameInfo;
}
