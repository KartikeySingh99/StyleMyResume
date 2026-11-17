# ai-suggestions (Appwrite Function)

Generates resume improvement suggestions. This exists so the **OpenAI API key never
reaches the browser** — previously the key was inlined into the client bundle via
`VITE_OPENAI_API_KEY` and could be read by any visitor.

## Deploy

1. **Rotate the leaked key first.** The old `VITE_OPENAI_API_KEY` must be considered
   public: revoke it at <https://platform.openai.com/api-keys> and create a new one.
2. Appwrite Console → **Functions** → **Create function**
   - Runtime: `Node 18` (or newer)
   - Entrypoint: `src/main.js`
   - Build command: `npm install`
   - Execute access: **Users** (so only signed-in users can run it)
3. Add function variables:
   | Key | Value |
   | --- | --- |
   | `OPENAI_API_KEY` | your **new** secret key |
   | `OPENAI_MODEL` | `gpt-4o-mini` (optional, this is the default) |
4. Deploy this directory:
   ```bash
   appwrite functions createDeployment \
     --functionId=<FUNCTION_ID> \
     --entrypoint='src/main.js' \
     --code='functions/ai-suggestions' \
     --activate=true
   ```
5. Copy the function ID into the web app's `.env`:
   ```
   VITE_APPWRITE_AI_FUNCTION_ID=<FUNCTION_ID>
   ```

Until step 5 is done the UI degrades gracefully: the suggestions panel shows
"AI suggestions aren't configured yet" instead of failing.

## Contract

Request body:

```json
{ "section": "experience", "data": "Experience 1: ..." }
```

Response:

```json
{ "section": "experience", "suggestions": ["Quantify the impact of ...", "..."] }
```

Errors return `{ "error": "message" }` with a 4xx/5xx status. Requests without an
authenticated Appwrite user are rejected with 401.
