// Entrypoint shim. The implementation lives in src/main.js; this exists so the
// function works whether Appwrite is configured with `main.js` or `src/main.js`
// as its entrypoint. Safe to delete once the entrypoint is confirmed.
export { default } from "./src/main.js";
