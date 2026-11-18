StyleMyResume — Audit & Improvement Plan

Stack: React 18 + Vite 4 + Redux Toolkit + Tailwind + MUI 5 + Appwrite 13 + OpenAI (client-side). Last commit June 2024, so deps are ~18 months stale. node_modules isn't installed locally.

What works well: clean route-level code splitting (App.jsx:15-22), the HOC pattern for templates (withTemplateWrapper.jsx), the ResumeReview completeness checklist is a genuinely good product idea, and drag-reorder on form sections is a nice touch.

---
🔴 P0 — Security / must fix before any growth

1. Your OpenAI API key ships to every visitor's browser.
src/appwrite/Suggestions.js:6-10 reads VITE_OPENAI_API_KEY and passes dangerouslyAllowBrowser: true. Every VITE_* var is inlined into the production bundle — anyone can open devtools and extract the key, then bill your account. Rotate the key now and move the call behind an Appwrite Function / serverless route. This also lets you add per-user rate limiting and caching.

2. Resume documents may be readable by any logged-in user.
database.js:29 creates documents with User_ID as the document ID and no permissions array — note Permission, Role are imported at line 2 but never used. That means access falls back to collection-level permissions. If the collection grants read to users (any authenticated user), anyone can call getDocument(someoneElsesUserId) and pull a stranger's full name, email, phone, and address. Fix: pass explicit document permissions:
[Permission.read(Role.user(User_ID)), Permission.update(Role.user(User_ID)), Permission.delete(Role.user(User_ID))]
and tighten the collection to document-level security in the Appwrite console.

3. javascript: URL injection in rendered links.
User-supplied project/LinkedIn/GitHub URLs go straight into href (Profile.jsx:250, Template1.jsx:127). Harmless today (self-inflicted), but it becomes a real XSS the moment resumes are shareable. Validate scheme is http(s) on save. Also every external link uses target="_" instead of target="_blank" rel="noopener noreferrer".

---
🟠 P1 — Correctness bugs (users hit these today)

4. Protected routes render for anonymous users, then crash. Two bugs compound:
- ProtectedRoute.jsx:13 — !isAuthenticated && !userData. Initial state is userData: {} (truthy), so the condition is false and children render immediately for a logged-out visitor. The redirect only fires later, after App.jsx resolves getCurrentUser() and dispatches logout().
- In that window, Profile.jsx:34-39 dispatches fetchUserData({}). That payload has neither userId nor status, so the thunk (userSlice.jsx:5-23) falls through and returns undefined — then fetchUserData.fulfilled (line 70) destructures undefined → TypeError → white screen (there's no error boundary).

Fix: gate on an explicit authChecked/loading flag (loading is already in state but unused by the guard), and make the thunk reject cleanly on an unusable payload.

5. Signup with an existing email reports success.
authSlice.jsx:16 only treats code === 400 as failure. Appwrite returns 409 for "user already exists" and 429 for rate limits — those fall into the else branch, set isCreated = true, and SignUp.jsx:19 navigates to / as if the account was created. Same flaw in the Login reducer (line 30 checks only 401). Check for any truthy error field instead of enumerating codes.

6. Validation loop only checks the last row, and silently drops data.
Details.jsx:255-268 (and the four identical copies at 270, 286, 301):
data.educationDetailsArray.map((d) => {
  if (Object.values(d).includes('')) return isEmpty = true;
  return isEmpty = false;   // ← overwrites previous rows
})
if (!isEmpty) { setEducationDetails(...) }
setValue(2)                  // ← advances regardless
isEmpty is reassigned every iteration, so only the final row decides. Worse, when validation does fail the section is never stored but the wizard still advances — the user submits and that entire section is missing from the saved resume with no error shown. Use .some(), surface a toast/inline error, and block the tab change.

7. "Add more" creates malformed rows that crash the renderer.
Form.jsx:78 calls append() with no argument, producing a row with no field keys. That row passes the (broken) emptiness check and gets saved, and then data.Responsibilities.split('\n') in Profile.jsx:208, Template1.jsx:104, Template2.jsx throws on undefined → white screen. Pass an explicit shape to append({ Company:'', Profile:'', ... }) and default the strings before .split().

8. After editing, the profile briefly goes blank. database.js:70-77 updateData has no return on success, so editData.fulfilled sets state.user.userData = undefined (userSlice.jsx:90). Profile recovers only because it refetches on mount.

9. API call inside a Redux reducer. userSlice.jsx:46-51 — the saveData reducer calls service.createData(...) directly. Reducers must be pure; this one fires an un-awaited network request whose rejection (database.js:42 rethrows) becomes an unhandled promise rejection, while Details.jsx:320 navigates to /profile immediately whether or not the save succeeded. Convert to createAsyncThunk and only navigate on fulfilment.

10. /about is a dead link. Listed in Header.jsx:54 and MobileMenu.jsx:35, but no route exists in App.jsx → blank page under the header. There's also no * catch-all 404 route.

11. AI suggestions break on error and show stale results. Suggestions.js:34 returns the error object on failure; SuggestionBot.jsx:41 then calls .split('\n') on it → crash. loading is initialised true but never reset before a new fetch, so reopening the panel shows the previous section's suggestions. Also max_tokens: 200 truncates most responses mid-sentence.

12. SPA deep links will 404 on Netlify. No _redirects or netlify.toml, and you're using BrowserRouter. Add public/_redirects with /*  /index.html  200.

13. prop-types is imported in 6 files but isn't in package.json. It resolves only transitively through MUI. Add it as a direct dependency.

14. Smaller ones: scroll listener never removed and its backgroundColor state is dead code since the class is hardcoded (Header.jsx:71-88); <> fragments inside .map() with keys commented out (MobileMenu.jsx:88); EditField.jsx references an undefined data variable (dead file); Footer.jsx is empty; Demo.jsx is unused; duplicate DOM ids panel1a-header inside loops (Form.jsx:107); 36 console.logs in production; Linkedin vs LinkedIn key casing mismatch (Details.jsx:76 vs :126); unused axios and react-alice-carousel deps; 853 KB unused public/login_page_pic.jpg plus 4 unused template images shipped in the bundle.

---
🏗️ Architecture & data model

The data model caps the product at one resume per user. The document ID is the Appwrite user ID (database.js:29), so a user can never have a second resume — and "one tailored resume per job application" is the core value proposition of this category. Move to ID.unique() documents with a userId index, and you unlock multiple resumes, versions, and duplication.

Sections are stored as JSON.stringify blobs. Cheap to ship, but you can't query, filter, or migrate, you're exposed to Appwrite's per-attribute size limit, and a single malformed blob kills JSON.parse in the reducer (userSlice.jsx:72-76, no try/catch). Either model sections as proper collections or at least validate with Zod on read.

The expirienceDetails typo is baked into your database schema. Fix it now with a one-time migration rather than in two years.

Redundant fetches. fetchUserData is dispatched in App.jsx:38, again in Profile.jsx:37, again in withTemplateWrapper.jsx:24, and again in Details.jsx:62 — every navigation re-fetches data already in the store. Add a staleness check or RTK Query.

No error boundary. Given how many .split() / destructure paths can throw, a single bad record = blank white page. Add one top-level boundary plus a fallback UI.

---
📄 The biggest product weakness: PDF export

FormatBar.jsx:18-20 uses react-to-print, which just opens the browser print dialog. Consequences:

- The A4 frame lg:w-[794px] lg:h-[1123px] (Template1.jsx:42) only applies at ≥1024px — on mobile the printed output isn't A4 at all, and the app is marketed to students who mostly browse on phones.
- h-[1123px] is a fixed height, so anything beyond one page is clipped. There is no multi-page support.
- Output depends on each browser's print engine (headers/footers, margin defaults, background-colour suppression).
- No Letter-size option for US applications.

This is the highest-leverage fix in the whole project: render the PDF deterministically (@react-pdf/renderer client-side, or an Appwrite Function with Puppeteer) with real page breaks, selectable text, and A4/Letter choice.

---
✨ Feature additions, by leverage

Tier 1 — High impact, small scope

┌────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│              Feature               │                                                                                         Why                                                                                          │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Job-description matching + ATS     │ Paste a JD → extract keywords → show match %, missing keywords, and per-bullet rewrite suggestions. This is the differentiator in the resume-builder space and you already have the  │
│ score                              │ AI plumbing.                                                                                                                                                                         │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Resume score 0–100                 │ Expand ResumeReview/Points.js beyond "section present?" into weighted scoring: quantified bullets, action verbs, length, bullet count, dates, keyword density. Gamifies completion.  │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Inline AI rewrite with             │ Today AI output is a read-only text dump in a modal (SuggestionBot.jsx). Make it per-bullet, with one-click apply. 10× the value for the same API cost.                              │
│ accept/reject                      │                                                                                                                                                                                      │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Autosave + unsaved-changes guard   │ The 5-tab wizard currently saves only on final submit — a refresh loses everything.                                                                                                  │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Multiple resumes +                 │ Unblocked by the data-model fix above.                                                                                                                                               │
│ duplicate/version                  │                                                                                                                                                                                      │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Profile photo upload               │ Profile.jsx:144 hardcodes a randomuser.me stock photo for every user. Use Appwrite Storage.                                                                                          │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ "Try without signup"               │ Let visitors build and preview with a sample resume; gate only the download. Big conversion lever.                                                                                   │
└────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Tier 2 — Editor depth

- Rich-text bullets. Right now bullets are a \n-split textarea (Form.jsx:125) — no bold, no links, fragile.
- Date pickers with a "Present" toggle, replacing free-text ex - dd/mm/yyyy (Details.jsx:230) which guarantees inconsistent formatting.
- Custom + reorderable sections: certifications, achievements, publications, languages, volunteering, courses; show/hide and drag-reorder whole sections, not just rows within one.
- Design controls: accent colour, font size, line height, density/spacing — you've already got font and margin, and setFontSize is wired but commented out (FormatBar.jsx:50-60).
- More templates. Only two exist, and five template images sit unused in public/. Also generate thumbnails from the real templates rather than static webp files that will drift.
- Live preview beside the form instead of a separate /template1 page.

Tier 3 — Platform

- Import: PDF/DOCX upload → AI-parse → prefill the wizard. Removes the biggest onboarding drop-off (typing everything).
- Export formats: DOCX, plain-text (for ATS paste-in), and JSON Resume for portability.
- Shareable public link (/r/kartikey-abc123) + QR code + view count.
- Cover letter generator reusing the same profile data.
- Auth completeness: Google/GitHub OAuth, email verification, forgot-password — none exist today.
- Job application tracker — natural adjacent product for the same audience.
- Dark mode, i18n (big for the Indian student market), analytics.

---
🧪 Engineering hygiene

- No tests, no CI. At minimum: Vitest for the reducers and the suggestion/validation helpers, plus one Playwright flow (signup → fill → download). Add a GitHub Action running lint + build + test.
- Lint is failing by its own config. --max-warnings 0 with unused errors destructures in Form.jsx:19, unused isUpdated in Details.jsx:43, unused vars in Template1.jsx:31-36, Header.jsx:32.
- Accessibility: clickable <div>/<span>/<p> throughout (Header.jsx:117, Profile.jsx:192, Form.jsx:78) aren't keyboard reachable; every <img> has alt="", including the hero and avatar; AuthForm.jsx:24 passes an object to MUI's error prop (expects boolean). This matters for a product whose users include people using screen readers.
- SEO/PWA is half-wired: no meta description or Open Graph tags, favicon is still vite.svg, src/manifest.json sits in src/ where it's never served, and VitePWA() runs with zero config (vite.config.js:9) so it generates its own default manifest ignoring your icons and theme colour.
- Stale AI model: gpt-3.5-turbo (Suggestions.js:16) is long superseded and weak at the rewriting task you're asking of it. When you move the call server-side, upgrade the model too.
- Dependency refresh: React 18→19, Vite 4→7, MUI 5→7, Appwrite SDK 13→latest (note: createEmailSession at appwriteConfig.js:28 was renamed to createEmailPasswordSession in SDK 14+, so that upgrade needs a code change). Consider TypeScript — this codebase's bug profile (undefined .split(), key casing, wrong shapes) is exactly what TS prevents.

---
Suggested sequencing

1. This week: rotate the OpenAI key → move AI server-side → lock down Appwrite document permissions → add _redirects.
2. Next: fix the auth-guard flash + the undefined payload crash, the 409 signup bug, the validation loop, append(), and add an error boundary. These are the ones actively losing user data.
3. Then: data-model migration (unique doc IDs + userId index, fix the expirience typo) — it unblocks multiple resumes, versions, and sharing.
4. Then: real multi-page PDF export.
5. Then: JD matching + ATS score + inline AI rewrite — this is what turns it from a form-filler into a product students recommend to each other.
