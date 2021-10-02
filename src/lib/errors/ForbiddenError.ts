/**
 * An error that indicates that client's IP is temp-blocked.
 * @public
 */
export class ForbiddenError extends Error {
    constructor() {
        super("Failed to handle the requested endpoint, IP temp-blocked.");
    }
}
