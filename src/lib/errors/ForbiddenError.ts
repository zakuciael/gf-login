export class ForbiddenError extends Error {
    constructor() {
        super("Failed to handle the requested endpoint, unauthorized/ip temp-blocked.");
    }
}
