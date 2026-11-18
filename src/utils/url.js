/**
 * Returns the url only if it is a safe, absolute http(s) link.
 * User supplied values reach `href` attributes directly, so anything that is
 * not http/https (`javascript:`, `data:`, ...) must never be rendered.
 * Bare domains like "linkedin.com/in/jane" are upgraded to https.
 */
export const safeUrl = (value) => {
    const raw = String(value ?? "").trim();
    if (!raw) return null;

    const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(raw) ? raw : `https://${raw}`;

    try {
        const url = new URL(candidate);
        if (url.protocol !== "http:" && url.protocol !== "https:") return null;
        if (!url.hostname.includes(".")) return null;
        return url.toString();
    } catch {
        return null;
    }
};

export default safeUrl;
