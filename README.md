# @zakku/gf-login

A node.js library for authenticating to GameFail's servers.

## Prerequisites

For this library to work it is required to have `openssl` installed on your system.
> Note: Versions prior to **2.0.0** doesn't require `openssl` but are bigger in size.

## Installation

#### NPM:

```bash
npm install @zakku/gf-login
```

#### Yarn:

```bash
yarn add @zakku/gf-login
```

#### PNPM:

```bash
pnpm add @zakku/gf-login
```

## Example Usage

```typescript
import {
    getGameforgeClientVersion,
    CertificateStore,
    getAccountToken,
    getGameAccounts,
    getGameToken,
    convertNostaleToken
} from "@zakku/gf-login";

const installationId = "8cd369b7-3f73-47c4-bf57-3544201ec275";
const clientVersion = await getGameforgeClientVersion();
const certStore = await CertificateStore.create(
    "./cert.p12", 
    "secret_gf_cert_password"
);

const authToken = await getAccountToken(
    "gf-login@gameforge.sucks.af",
    "gfpls",
    installationId
);

const gameAccount = (await getGameAccounts(authToken, installationId))
    .find(acc => acc.accountName === "make_nostale_greate_again");

const gameToken = await getGameToken(
    authToken,
    gameAccount,
    installationId,
    clientVersion,
    certStore
);

const loginSession = convertNostaleToken(gameToken);
```