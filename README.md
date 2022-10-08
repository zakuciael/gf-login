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
    GameforgeAPI,
    convertNostaleToken,
    GfLang,
    GfLocale,
} from "@zakku/gf-login";

const email = "gf-login@gameforge.sucks.af";
const password = "gfpls";
const installationId = "8cd369b7-3f73-47c4-bf57-3544201ec275";


// Identity.generateIdentity("./certs/identity.json");
const identity = new Identity("./identity.json");

const certStore = CertificateStore.create("./cert.p12", "secret_gf_cert_password");
// const certStore = CertificateStore.createFromPem("./all_certs.pem");

const acc = new GameforgeAPI({
    locale: GfLocale.pl_PL,
    gfLang: GfLang.pl,
    installationId: installationId,
    identity: identity,
    certStore: certStore,
});
await acc.authenthicate(email, password);

const accList = await acc.getGameAccounts();
console.dir(accList);

const gameToken = await acc.getGameToken(accList[0]);
console.log(gameToken);

const loginSession = convertNostaleToken(gameToken);
console.log(loginSession);
```

## Credits
- Special thanks to [Xeno](https://github.com/imxeno) and [Lank](https://github.com/Lank891) for the help in reverse engineering **the User-Agent "magic" hash** and **a method for extracting the client's certificates**.
