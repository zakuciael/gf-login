export const getFirstNumberFromString = (str: string): number | undefined => {
    const matcher = str.match(/\d/);
    return matcher != undefined ? parseInt(matcher[0]) : undefined;
};

export const getStringFromRight = (str: string, length: number): string => {
    return str.substring(str.length - length, str.length);
};

export const getStringFromLeft = (str: string, length: number): string => {
    return str.substring(0, length);
};
