export class InvalidResponseError extends Error {
    public readonly statusText: string;
    public readonly status: number;

    constructor(status: number, statusText: string) {
        super("An invalid response was received from the server");
        this.statusText = statusText;
        this.status = status;
    }
}
