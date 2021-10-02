/**
 * Converts the UUID token into NosTale's login token
 * @param token - The token to convert
 * @return - Converted token
 */
export const convertNostaleToken = (token: string): string => {
    return token
        .split("")
        .map((char) => char.charCodeAt(0).toString(16))
        .join("");
};
