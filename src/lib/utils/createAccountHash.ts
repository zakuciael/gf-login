import { getFirstNumberFromString, getStringFromLeft, getStringFromRight } from "./strings";
import { GameforgeClientVersion } from "../../types";
import { CertificateStore } from "./CertificateStore";
import { sha1, sha256 } from "./crypto";

/**
 * Creates account hash used in the API
 * @public
 * @param accountID - The account id used in the API request
 * @param installationID - The installation id used in the API request
 * @param clientVersion - The client version used in the API request
 * @param certificateStore - The certificate store loaded with Gameforge's certificate
 * @return Generated account hash or undefined if specified wrong installation id
 */
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
                        sha1("C" + clientVersion.version) +
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
                        sha256("C" + clientVersion.version) +
                        sha1(installationID) +
                        sha256(accountID)
                ),
                8
            )
        );
    }
};
