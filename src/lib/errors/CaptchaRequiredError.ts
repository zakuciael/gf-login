/**
 * @public
 */
export class CaptchaRequiredError extends Error {
    public readonly challengeId: string;

    constructor(challengeId: string) {
        super("Failed to handle the requested endpoint, captcha is required");
        this.challengeId = challengeId;
    }
}
