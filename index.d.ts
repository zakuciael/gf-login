import { GameAccount, GameforgeClientVersion } from "./src";

export declare enum GameforgeClientReleaseVersions {
    Final = "final-ms3",
    Beta = "beta-ms3",
    QualityAssurance2 = "qa2-ms3",
    QualityAssurance1 = "qa1-ms3",
}

export declare interface GameforgeClientVersion {
    version: string;
    branch: string;
    commitId: string;
}

export declare interface GetAccountTokenOptions {
    autoCaptcha?: boolean;
    maxCaptchaAttempts?: number;
    challengeId?: string;
}

export declare interface GameInfo {
    id: string;
    name: string;
}

export declare interface GameAccount {
    id: string;
    accountName: string;
    usernames: string[];
    game: GameInfo;
}

export declare class CaptchaRequiredError extends Error {
    public readonly challengeId: string;
}

export declare class InvalidResponseError extends Error {
    public readonly statusText: string;
    public readonly status: number;
}

export declare class UnauthorizedError extends Error {}

export declare class ForbiddenError extends Error {}

export declare class CertificateStore {
    constructor(fullCertPath: string, certPassword: string, hashCertPath: string);

    get fullCert(): Buffer;

    get hashCert(): Buffer;

    get password(): string;
}

export declare const getGameforgeClientVersion: (
    releaseVersion?: GameforgeClientReleaseVersions
) => Promise<GameforgeClientVersion | undefined>;

export declare const sendStartTimeEvent: (
    installationId: string,
    clientVersion: GameforgeClientVersion
) => Promise<void>;

export declare const getAccountToken: (
    email: string,
    password: string,
    installationID: string,
    opts?: GetAccountTokenOptions
) => Promise<string>;

export declare const getGameAccounts: (
    authToken: string,
    installationID: string
) => Promise<GameAccount[]>;

export declare const getGameToken: (
    authToken: string,
    accountID: string,
    installationID: string,
    clientVersion: GameforgeClientVersion
) => Promise<string>;

export declare const createAccountHash: (
    accountID: string,
    installationID: string,
    clientVersion: GameforgeClientVersion
) => string | undefined;

export declare const convertNostaleToken: (token: string) => string;
