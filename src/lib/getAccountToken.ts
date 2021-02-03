import { CaptchaRequiredError, ForbiddenError, InvalidResponseError } from "./errors";
import { LoginCaptcha, loginMethod, solveCaptcha } from "@banzar-team/ez-captcha";
import fetch from "node-fetch";

const generateCaptchaLoginMethod = (
    email: string,
    password: string,
    installationID: string
): loginMethod => {
    return (): Promise<LoginCaptcha> => {
        return getAccountToken(email, password, installationID, false)
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

export const getAccountToken = (
    email: string,
    password: string,
    installationID: string,
    autoCaptcha = true,
    maxCaptchaAttempts?: number
): Promise<string> => {
    return fetch(`https://spark.gameforge.com/api/v1/auth/sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "TNT-Installation-Id": installationID,
        },
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
                if (!autoCaptcha) throw new CaptchaRequiredError(challengeId);

                const captchaResponse = await solveCaptcha(
                    challengeId,
                    generateCaptchaLoginMethod(email, password, installationID),
                    maxCaptchaAttempts
                );

                if (!captchaResponse.solved) throw new CaptchaRequiredError(captchaResponse.id);
                return getAccountToken(email, password, installationID, false);
            } else if (!res.ok) throw new InvalidResponseError(res.status, res.statusText);
        })
        .then((data) => {
            if (typeof data === "string") return data as string;
            else return data.token as string;
        });
};
