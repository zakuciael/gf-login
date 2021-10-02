/**
 * Represents different Gameforge Client release versions
 * @public
 */
export enum GameforgeClientReleaseVersions {
    /**
     * Public release, used by regular users
     */
    Final = "final-ms3",
    /**
     * Beta release, containing features not released to the public
     */
    Beta = "beta-ms3",
    /**
     * Testing release, restricted to testers, contains potentially breaking/buggy changes.
     */
    QualityAssurance2 = "qa2-ms3",
    /**
     * Testing release, restricted to testers, contains potentially breaking/buggy changes.
     */
    QualityAssurance1 = "qa1-ms3",
}
