/**
 * An error that indicates that request requires captcha to be solved before proceeding.
 * @public
 */
export class CaptchaRequiredError extends Error {
    /**
     * The challenge id required to solve the captcha
     */
    public readonly challengeId: string;

    /**
     * @param challengeId - The challenge id required to solve the captcha
     */
    constructor(challengeId: string) {
        super("Failed to handle the requested endpoint, captcha is required");
        this.challengeId = challengeId;
    }
}
