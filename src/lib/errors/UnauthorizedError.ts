/**
 * An error that indicates that client is not authenticated.
 * @public
 */
export class UnauthorizedError extends Error {
    constructor() {
        super("Failed to handle the requested endpoint, unauthorized.");
    }
}
