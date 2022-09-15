# @zakku/gf-login

A node.js library for authenticating to GameFail's servers.

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
    CertificateStore,
    Identity,
    GfAccount,
    convertNostaleToken,
} from "@zakku/gf-login";

const email = "gf-login@gameforge.sucks.af";
const password = "gfpls";
const installationId = "8cd369b7-3f73-47c4-bf57-3544201ec275";


const identity = new Identity();
await identity.load("./identity.json");

// const certStore = CertificateStore.create("./cert.p12", "secret_gf_cert_password");
const certStore = CertificateStore.createFromPem("./all_certs.pem");

const a = new GfAccount({
    locale: "pl_PL",
    gfLang: "pl",
    installationId: installationId,
    identity: identity,
    certStore: certStore,
});
await a.authenthicate(email, password);

const accList = await a.getAccounts();
console.dir(accList);

const gameToken = await a.getToken(accList[0]);
console.log(gameToken);

const loginSession = convertNostaleToken(gameToken);
console.log(loginSession);
```

## Credits
- Special thanks to [Xeno](https://github.com/imxeno) and [Lank](https://github.com/Lank891) for the help in reverse engineering **the User-Agent "magic" hash** and **a method for extracting the client's certificates**.
