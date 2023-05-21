export function addToken(options) {
    const update = { ...options };
    if (sessionStorage.jwt) {
        update.headers = {
            ...update.headers,
            Authorization: `Bearer ${localStorage.jwt}`,
        };
    }
    return update;
}

export default function fetcher(url, options = {}) {
    return fetch(url, addToken(options));
}