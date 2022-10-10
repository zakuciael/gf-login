import {
    CertificateStore,
    convertNostaleToken,
    GameforgeAPI,
    GfLang,
    GfLocale,
    Fingerprint,
} from "../src/index";

const email = "gf-login@gameforge.sucks.af";
const password = "gfpls";
const installationId = "8cd369b7-3f73-47c4-bf57-3544201ec275";

async function main() {
    const fingerprint = Fingerprint.fromFile("./identity.json");

    const certStore = CertificateStore.create("./cert.p12", "secret_gf_cert_password");
    // const certStore = CertificateStore.createFromPem("./all_certs.pem");

    const acc = new GameforgeAPI({
        locale: GfLocale.pl_PL,
        gfLang: GfLang.pl,
        installationId: installationId,
        fingerprint: fingerprint,
        certStore: certStore,
    });
    await acc.authenthicate(email, password);

    const accList = await acc.getGameAccounts();
    console.dir(accList);

    const gameToken = await acc.getGameToken(accList[0]);
    console.log(gameToken);

    const loginSession = convertNostaleToken(gameToken);
    console.log(loginSession);
}

main();
