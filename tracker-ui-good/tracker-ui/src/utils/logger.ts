const isDev = import.meta.env?.MODE !== "production";

export const debug = (...args: unknown[]): void => {
    if (isDev) {
        console.debug(...args);
    }
};

export const info = (...args: unknown[]): void => {
    if (isDev) {
        console.info(...args);
    }
};

export const warn = (...args: unknown[]): void => {
    if (isDev) {
        console.warn(...args);
    }
};

export const error = (...args: unknown[]): void => {
    console.error(...args);
};
