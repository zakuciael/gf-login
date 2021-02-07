export const convertNostaleToken = (token: string): string => {
    return token
        .split("")
        .map((char) => char.charCodeAt(0).toString(16))
        .join("");
};
