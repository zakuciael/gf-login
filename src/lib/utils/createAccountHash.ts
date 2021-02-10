import { getFirstNumberFromString, getStringFromLeft, getStringFromRight } from "./strings";
import { getCharFromType, sha1, sha256 } from "./crypto";
import { GameforgeClientVersion } from "../../types";
import { CertificateStore } from "./CertificateStore";
import { CharType } from "../../types/CharType";

export const createAccountHash = (
    accountID: string,
    installationID: string,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore
): string | undefined => {
    const firstNumber = getFirstNumberFromString(installationID);
    if (firstNumber === undefined) return undefined;

    if (firstNumber % 2 === 0) {
        return (
            accountID.substr(0, 2) +
            getStringFromLeft(
                sha256(
                    sha256(certificateStore.hashCert) +
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
                    sha1(certificateStore.hashCert) +
                        sha256(getCharFromType(CharType.RETURN_C) + clientVersion.version) +
                        sha1(installationID) +
                        sha256(accountID)
                ),
                8
            )
        );
    }
};
