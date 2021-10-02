import { CaptchaRequiredError, ForbiddenError, InvalidResponseError } from "./errors";
import { LoginCaptcha, loginMethod, solveCaptcha } from "@zakku/ez-captcha";
import fetch from "node-fetch";

/**
 * Represents options passed to {@link getAccountToken} method.
 * @public
 */
export interface GetAccountTokenOptions {
    /**
     * Specifies if auto-captcha system should be enabled for the request
     * @default true
     */
    autoCaptcha?: boolean;
    /**
     * Maximum amount of attempts at solving captcha
     * @default 5
     */
    maxCaptchaAttempts?: number;
    /**
     * The challenge id required to solve the captcha
     * @default Resolved by the auto-captcha system
     */
    challengeId?: string;
}

const generateCaptchaLoginMethod = (
    email: string,
    password: string,
    installationID: string
): loginMethod => {
    return (): Promise<LoginCaptcha> => {
        return getAccountToken(email, password, installationID, { autoCaptcha: false })
            .then(() => ({
                requireCaptcha: false,
            }))
            .catch((err) => {
                if (err instanceof CaptchaRequiredError)
                    return { requireCaptcha: true, id: err.challengeId };
                else throw err;
            });
    };
};

/**
 * Authenticates to the API using Gameforge account
 * @param email - The account's email address
 * @param password - The account's password
 * @param installationID - The installation id
 * @param opts - Additional options
 * @return The account's auth token
 */
export const getAccountToken = (
    email: string,
    password: string,
    installationID: string,
    opts?: GetAccountTokenOptions
): Promise<string> => {
    const options: GetAccountTokenOptions = Object.assign({ autoCaptcha: true }, opts);

    return fetch(`https://spark.gameforge.com/api/v1/auth/sessions`, {
        method: "POST",
        headers: Object.assign(
            {
                "Content-Type": "application/json",
                "TNT-Installation-Id": installationID,
            },
            options.challengeId ? { "gf-challenge-id": options.challengeId } : undefined
        ),
        body: JSON.stringify({
            email,
            password,
            locale: "en_GB",
        }),
    })
        .then(async (res) => {
            const challengeIdHeader = res.headers.get("gf-challenge-id");

            if (res.ok) return res.json();
            else if (res.status === 403) throw new ForbiddenError();
            else if (res.status === 409 && challengeIdHeader) {
                const challengeId = challengeIdHeader.split(";")[0];
                if (!options.autoCaptcha) throw new CaptchaRequiredError(challengeId);

                const captchaResponse = await solveCaptcha(
                    challengeId,
                    generateCaptchaLoginMethod(email, password, installationID),
                    options.maxCaptchaAttempts
                );

                if (!captchaResponse.solved) throw new CaptchaRequiredError(captchaResponse.id);
                return getAccountToken(email, password, installationID, {
                    autoCaptcha: false,
                    challengeId: captchaResponse.id,
                });
            } else if (!res.ok) throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data) => {
            if (typeof data === "string") return data as string;
            else return data.token as string;
        });
};
