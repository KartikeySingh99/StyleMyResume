# Data model migration — one resume per user → many

Moves resume documents off "document id = Appwrite user id" and onto
`ID.unique()` ids found via an indexed owner attribute. That cap was the reason
an account could only ever hold one resume.

**Order matters.** Step 1 must happen *before* you deploy the new web build,
because owner-scoped lookups fail without the index.

---

## 1. Schema changes (Appwrite console)

In your resumes collection:

| Action | Attribute | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| **Add index** | `User_ID` | key, ASC | — | name it `userId_idx`. **Required** — `Query.equal` errors without it. |
| **Create** | `experienceDetails` | String (size ≥ old attribute) | No | corrected spelling of `expirienceDetails` |
| **Create** | `title` | String (255) | No | lets a picker tell resumes apart |
| **Keep for now** | `expirienceDetails` | — | — | delete only after step 4 |

`User_ID` is kept as the owner attribute rather than renamed to `userId`:
Appwrite cannot rename an attribute in place, so renaming would mean a second
create-backfill-drop cycle for no functional gain. It already exists and is
already populated on every document.

Also set the collection to **Document security = enabled** so per-document
permissions take effect.

## 2. Install and configure

```bash
cd scripts
npm install
```

Export the credentials — these are **server-side only**. The API key must never
go in the web app's `.env` (anything there is `VITE_`-prefixed and ships to the
browser):

```bash
# Reuse the endpoint and project id from the web app's own .env — those are
# already known to work. Cloud projects live on regional hosts, so the bare
# cloud.appwrite.io host often fails with `api_key_invalid`.
export APPWRITE_ENDPOINT="$(grep VITE_APPWRITE_URL ../.env | cut -d= -f2-)"
export APPWRITE_PROJECT_ID="$(grep VITE_APPWRITE_PROJECT_ID ../.env | cut -d= -f2-)"
export APPWRITE_DATABASE_ID="$(grep VITE_APPWRITE_DATABASE_ID ../.env | cut -d= -f2-)"
export APPWRITE_COLLECTION_ID="$(grep VITE_APPWRITE_COLLECTION_ID ../.env | cut -d= -f2-)"
export APPWRITE_API_KEY=...   # server key; needs documents.read + documents.write
```

The API key is the only value you type by hand. Create it under
**Settings -> API Keys** in the *same* project — a key from another project
fails with `api_key_invalid`, which is an identity error, not a scope error.

## 3. Run it

Always dry-run first — it writes nothing and prints exactly what would change:

```bash
npm run migrate:dry
```

Then apply:

```bash
npm run migrate
```

Per document the script will:

1. copy `expirienceDetails` → `experienceDetails` (only when the new attribute
   is blank, so it never overwrites newer content);
2. set `User_ID` from `$id` if missing (old documents identified the owner by
   document id alone);
3. set `title` to "My Resume" if blank;
4. set owner-only document permissions — this closes the gap where documents
   created before the security fix fell back to collection-level rules.

It is **idempotent**: re-running reports `already migrated` and writes nothing.
Documents with no recoverable owner are skipped and listed, never guessed.

If replacing permissions would remove an entry that isn't an owner permission,
the script prints what it removed rather than dropping it silently. Check the
dry-run output for a "Permissions replaced" section before applying.

## 4. Verify, then clean up

Order matters here too. A **deployed older build still reads
`expirienceDetails`**, so deleting that attribute before the new build is live
breaks production (the old code has no null-safety around
`Responsibilities.split()`).

1. Load the app **locally** and confirm an existing resume renders, including
   the Experience section. Edit and save it — that exercises the new
   document-id write path.
2. Deploy the new build. Remember Vite inlines `import.meta.env.*` at build
   time, so set any new variables in Netlify **before** triggering the build.
3. Verify a resume renders on the deployed site.
4. Only now delete the `expirienceDetails` attribute in the console.
5. Remove the read fallback for the old spelling in `src/slices/userSlice.jsx`
   (`experienceDetails ?? expirienceDetails`) — it is dead code once the
   attribute is gone.
6. **Delete the migration API key.** It carries document write access, the app
   never uses it, and it is not needed again.

Until step 4 the app reads **either** spelling (`src/slices/userSlice.jsx`
falls back to the old name), so old and new documents both work. That fallback
is what makes the deploy safe to do before the backfill finishes — remove it
once the old attribute is gone.

## Rollback

The migration only adds data; it does not delete the old attribute. To roll
back, redeploy the previous web build — it reads `expirienceDetails`, which is
still present and still populated. The one non-additive change is document
permissions; if you need the old behaviour, re-grant access at the collection
level and disable document security.
