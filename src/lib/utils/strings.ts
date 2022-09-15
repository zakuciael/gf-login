/**
 * @internal
 */
export const getFirstNumberFromString = (str: string): number | undefined => {
    const matcher = str.match(/\d/);
    return matcher != undefined ? parseInt(matcher[0]) : undefined;
};

/**
 * @internal
 */
export const getStringFromRight = (str: string, length: number): string => {
    return str.substring(str.length - length, str.length);
};

/**
 * @internal
 */
export const getStringFromLeft = (str: string, length: number): string => {
    return str.substring(0, length);
};

export function randomIntFromInterval(min: number, max: number): number {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomAsciiCharacter(): string {
    return String.fromCharCode(randomIntFromInterval(33, 125));
}

export function randomString(size: number): string {
    const str: string[] = [];
    for (let i = 0; i < size; i++) {
        str.push(randomAsciiCharacter());
    }
    return str.join("");
}

export function randomString2(length: number): string {
    let r = "";
    const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const l = c.length;
    for (let i = 0; i < length; i++) {
        r += c.charAt(Math.floor(Math.random() * l));
    }
    return r;
}
