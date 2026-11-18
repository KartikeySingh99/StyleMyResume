# ai-suggestions (Appwrite Function)

Generates resume improvement suggestions using **Google Gemini**. This exists so
the API key **never reaches the browser** — the original implementation read
`VITE_OPENAI_API_KEY` in client code, and every `VITE_*` variable is inlined
into the public bundle where any visitor could read it.

Zero npm dependencies: it calls the Gemini REST API with `fetch`, so Appwrite
builds are fast and there is no SDK version to drift.

## Deploy

1. **Get a Gemini API key** at <https://aistudio.google.com/apikey>. The free
   tier needs no card.
2. Appwrite Console → **Functions** → **Create function** → Manual:
   - Runtime: `Node 18` (or newer — `fetch` must be global)
   - Entrypoint: `src/main.js`
   - Build command: `npm install`
   - Execute access: **Users** (only signed-in users can run it)
3. Add function variables under the function's **Settings** tab:

   | Key | Value |
   | --- | --- |
   | `GEMINI_API_KEY` | your key |
   | `GEMINI_MODEL` | optional; defaults to `gemini-2.5-flash` |

4. Deploy this directory. Either upload a tarball
   (`tar -czf ai-suggestions.tar.gz -C functions/ai-suggestions .` → function →
   Deployments → Create deployment → Manual), or use the CLI — check
   `appwrite functions createDeployment --help` first, as the flags differ
   between CLI versions.
5. Copy the function ID into the web app's environment as
   `VITE_APPWRITE_AI_FUNCTION_ID` (locally in `.env`, and in Netlify). Vite
   inlines it at build time, so trigger a **rebuild**, not just a redeploy.

Until step 5 the UI degrades gracefully: the suggestions panel shows
"AI suggestions aren't configured yet" rather than failing.

## Contract

Request body:

```json
{ "section": "experience", "data": "Experience 1: ..." }
```

Response:

```json
{ "section": "experience", "suggestions": ["Quantify the impact of ...", "..."] }
```

Errors return `{ "error": "message" }` with a 4xx/5xx status. Requests without
an authenticated Appwrite user are rejected with 401. Rate limits (429) and
Gemini safety blocks are both turned into readable messages rather than
crashing the client.

## Troubleshooting

Check the function's **Executions** tab for logs.

| Symptom | Cause |
| --- | --- |
| `Model "..." is not available for this key` | Gemini model names change. Set `GEMINI_MODEL` to one your key can use. |
| `Suggestions are not configured yet` | `GEMINI_API_KEY` variable missing or misspelled. |
| `Suggestions are misconfigured. Check the API key.` | Gemini returned 400/403 — usually an invalid or restricted key. |
| 401 from the function | Execute access isn't set to **Users**. |

## Switching providers

Provider-specific code is confined to `buildRequestBody`, `extractSuggestions`
and the single `fetch` call. The prompt, auth check, section validation and the
entire client side are provider-agnostic — the client only ever receives
`{ suggestions: string[] }`.
