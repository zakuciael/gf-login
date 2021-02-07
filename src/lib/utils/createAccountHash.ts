import { getFirstNumberFromString, getStringFromLeft, getStringFromRight } from "./strings";
import { GameforgeClientVersion } from "../../types/GameforgeClientVersion";
import { getCharFromType, sha1, sha256 } from "./crypto";
import { hashCertificate } from "./certificates";
import { CharType } from "../../types/CharType";

export const createAccountHash = (
    accountID: string,
    installationID: string,
    clientVersion: GameforgeClientVersion
): string | undefined => {
    const firstNumber = getFirstNumberFromString(installationID);
    if (firstNumber === undefined) return undefined;

    if (firstNumber % 2 === 0) {
        return (
            accountID.substr(0, 2) +
            getStringFromLeft(
                sha256(
                    sha256(hashCertificate) +
                        sha1(getCharFromType(CharType.RETURN_C) + clientVersion.version) +
                        sha256(installationID) +
                        sha1(accountID)
                ),
                8
            )
        );
    } else {
        return (
            accountID.substr(0, 2) +
            getStringFromRight(
                sha256(
                    sha1(hashCertificate) +
                        sha256(getCharFromType(CharType.RETURN_C) + clientVersion.version) +
                        sha1(installationID) +
                        sha256(accountID)
                ),
                8
            )
        );
    }
};
