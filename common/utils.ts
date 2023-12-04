export function hasDecimals(num: number): boolean {
    return num % 1 !== 0;
}

export function localStorageKeyExists(key: string): boolean {
    const value = localStorage.getItem(key);
    return value !== null;
}