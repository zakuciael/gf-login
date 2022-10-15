export class Base64 {
    public static decode(data: string): string {
        return Buffer.from(data, "base64").toString("utf-8");
    }

    public static encode(text: string): string {
        return Buffer.from(text, "utf-8").toString("base64");
    }

    public static urlSafeEncode(text: string): string {
        let x = Buffer.from(text, "latin1").toString("base64");
        x.split("/").forEach(() => {
            x = x.replace("/", "_");
        });
        x.split("+").forEach(() => {
            x = x.replace("+", "-");
        });
        return x;
    }
}
