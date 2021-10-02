/**
 * @public
 */
export interface GameInfo {
    id: string;
    name: string;
}

/**
 * @public
 */
export interface GameAccount {
    id: string;
    accountName: string;
    usernames: string[];
    game: GameInfo;
}
