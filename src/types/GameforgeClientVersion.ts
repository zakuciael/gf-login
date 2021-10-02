/**
 * Represents client version information
 * @public
 */
export interface GameforgeClientVersion {
    /**
     * Client version following semantic versioning
     */
    version: string;
    /**
     * Branch or Tag on which client was built
     */
    branch: string;
    /**
     * Git commit id that points to this client build
     */
    commitId: string;
}
