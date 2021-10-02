/**
 * Represents the information about the game to which an account is bound
 * @public
 */
export interface GameInfo {
    /**
     * Game id used by the API
     */
    id: string;
    /**
     * Full name of the game
     */
    name: string;
}

/**
 * Represents the Game account info received from Gameforge API
 * @public
 */
export interface GameAccount {
    /**
     * Account id used by the API
     */
    id: string;
    /**
     * Account name
     */
    accountName: string;
    /**
     * List of usernames associated with the account
     */
    usernames: string[];
    /**
     * Information about the game to which this account is bound
     */
    game: GameInfo;
}
