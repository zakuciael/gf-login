# GF Login

A node.js library for authenticating to GameFail's servers.

## Installation

```bash
yarn add @zakku/gf-login
# or
npm i @zakku/gf-login
```

## Usage

```typescript
import {
  getGameforgeClientVersion,
  CertificateStore,
  getAccountToken,
  getGameAccounts,
  getGameToken,
  convertNostaleToken
} from "@zakku/gf-login";

const certStore = new CertificateStore("./certs/full.p12", "1234567890", "./certs/hash.txt");
const installationId = "8cd369b7-3f73-47c4-bf57-3544201ec275";
const clientVersion = await getGameforgeClientVersion();

const authToken = await getAccountToken(
  "gf-login@gameforge.sucks.af",
  "gfpls",
  installationId
);

const accountId = (await getGameAccounts(authToken, installationId))
  .find(acc => acc.accountName === "make_nostale_greate_again").id;

const gameToken = await getGameToken(
  authToken,
  accountId,
  installationId,
  clientVersion,
  certStore
);

const loginSession = convertNostaleToken(gameToken);
```

## API

### Types

- ### GetAccountTokenOptions [Object]
    - **autoCaptcha**?: boolean
    - **maxCaptchaAttempts**?: number
    - **challengeId**?: string
- ### GameforgeClientVersion [Object]
    - **version**: string
    - **branch**: string
    - **commitId**: string
- ### GameAccount [Object]
    - **id**: string
    - **accountName**: string
    - **usernames**: string[]
    - **game**: GameInfo
- ### GameInfo [Object]
    - **id**: string
    - **name**: string
- ### GameforgeClientReleaseVersions [Enum]
    - **Final**: "final-ms3"
    - **Beta**: "beta-ms3"
    - **QualityAssurance2**: "qa2-ms3"
    - **QualityAssurance1**: "qa1-ms3"

### Converters

- ### convertNostaleToken(token)
    - **token**: string

### Errors

- ### CaptchaRequiredError(challengeId)
    - **challengeId**: string
- ### InvalidResponseError(status, statusText)
    - **status**: number
    - **statusText**: string
- ### UnauthorizedError()
- ### ForbiddenError()

### Utils

- ### CertificateStore(fullCertPath, certPassword, hashCertPath)
    - **fullCertPath**: string
    - **certPassword**: string
    - **hashCertPath**: string
- ### createAccountHash(accountID, installationID, clientVersion, certificateStore)
    - **accountID**: string
    - **installationID**: string
    - **clientVersion**: GameforgeClientVersion
    - **certificateStore**: CertificateStore

### Methods

- ### getAccountToken(email, password, installationID, opts)
    - **email**: string
    - **password**: string
    - **installationID**: string
    - **opts**?: GetAccountTokenOptions
- ### getGameAccounts(authToken, installationID)
    - **authToken**: string
    - **installationID**: string
- ### getGameforgeClientVersion(releaseVersion)
    - **releaseVersion**?: GameforgeClientReleaseVersions
- ### getGameToken(authToken, accountID, installationID, clientVersion, certificateStore)
    - **authToken**: string
    - **accountID**: string
    - **installationID**: string
    - **clientVersion**: GameforgeClientVersion
    - **certificateStore**: CertificateStore
- ### sendStartTimeEvent(installationId, clientVersion, certificateStore)
    - **installationId**: string
    - **clientVersion**: GameforgeClientVersion
    - **certificateStore**: CertificateStore