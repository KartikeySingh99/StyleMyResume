#!/usr/bin/env node
/**
 * One-off migration to the multi-resume data model.
 *
 *   node scripts/migrate-resumes.mjs --dry-run   # inspect, change nothing
 *   node scripts/migrate-resumes.mjs             # apply
 *
 * Idempotent — safe to re-run. See scripts/README.md for setup.
 */
import { Client, Databases, Query } from "node-appwrite";
import { planDocumentUpdate } from "./lib/transform.mjs";

const DRY_RUN = process.argv.includes("--dry-run");
const PAGE_SIZE = 100;

const required = [
    "APPWRITE_ENDPOINT",
    "APPWRITE_PROJECT_ID",
    "APPWRITE_API_KEY",
    "APPWRITE_DATABASE_ID",
    "APPWRITE_COLLECTION_ID",
];

const missingEnv = required.filter((key) => !process.env[key]);
if (missingEnv.length) {
    console.error(`Missing env vars: ${missingEnv.join(", ")}`);
    console.error("See scripts/README.md.");
    process.exit(1);
}

const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    APPWRITE_DATABASE_ID,
    APPWRITE_COLLECTION_ID,
} = process.env;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function* eachDocument() {
    let cursor = null;
    while (true) {
        const queries = [Query.limit(PAGE_SIZE)];
        if (cursor) queries.push(Query.cursorAfter(cursor));

        const { documents } = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_ID,
            queries
        );

        if (!documents.length) return;
        for (const document of documents) yield document;

        if (documents.length < PAGE_SIZE) return;
        cursor = documents[documents.length - 1].$id;
    }
}

/** Config mistakes are predictable here — explain them instead of dumping a stack. */
function explainFailure(error) {
    const code = error?.code;
    const type = error?.type;
    console.error(`\nAppwrite request failed (${code ?? "no status"}${type ? ` ${type}` : ""}): ${error?.message ?? error}`);

    if (type === "api_key_invalid" || code === 401) {
        console.error(
            "\nThe key is not valid for this project. In order of likelihood:\n" +
            "  1. The API key belongs to a different project than APPWRITE_PROJECT_ID.\n" +
            "  2. APPWRITE_ENDPOINT is wrong. Appwrite Cloud projects live on regional hosts\n" +
            "     (e.g. https://fra.cloud.appwrite.io/v1). Copy it verbatim from\n" +
            "     Console -> Settings -> API Endpoint.\n" +
            "  3. The value is not a server API key (a project id or JWT will fail this way).\n" +
            "Check without revealing the key: echo \"len: ${#APPWRITE_API_KEY}\""
        );
    } else if (type === "general_unauthorized_scope" || type === "user_unauthorized") {
        console.error("\nThe key is valid but missing scopes. Grant documents.read and documents.write.");
    } else if (code === 404) {
        console.error("\nNot found — check APPWRITE_DATABASE_ID and APPWRITE_COLLECTION_ID.");
    } else if (/attribute/i.test(error?.message ?? "")) {
        console.error(
            "\nAttribute problem. Confirm `experienceDetails` and `title` exist and show\n" +
            "status `available`, and that the owner attribute is really named `User_ID`\n" +
            "(if not, update OWNER_ATTRIBUTE in scripts/lib/transform.mjs and src/appwrite/database.js)."
        );
    }

    console.error("\nNothing was written." + (DRY_RUN ? "" : " Re-run with --dry-run once the config is fixed."));
}

const stats = { seen: 0, updated: 0, alreadyMigrated: 0, skipped: 0, failed: 0 };
const dropped = [];

console.log(DRY_RUN ? "DRY RUN — no writes will be made\n" : "Applying migration\n");

try {
    for await (const document of eachDocument()) {
        stats.seen++;
        const plan = planDocumentUpdate(document);

        if (plan.skipped) {
            stats.skipped++;
            console.warn(`  SKIP  ${document.$id}: ${plan.reasons.join("; ")}`);
            continue;
        }

        if (!plan.needsUpdate) {
            stats.alreadyMigrated++;
            continue;
        }

        if (plan.droppedPermissions.length) {
            dropped.push({ id: document.$id, permissions: plan.droppedPermissions });
        }

        console.log(`  ${DRY_RUN ? "WOULD" : "APPLY"} ${document.$id}: ${plan.reasons.join("; ")}`);

        if (DRY_RUN) {
            stats.updated++;
            continue;
        }

        try {
            await databases.updateDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID,
                document.$id,
                plan.data,
                plan.permissions ?? undefined
            );
            stats.updated++;
        } catch (error) {
            stats.failed++;
            console.error(`  FAIL  ${document.$id}: ${error?.message ?? error}`);
        }
    }
} catch (error) {
    // Thrown by listDocuments — i.e. we never got a usable page of documents.
    explainFailure(error);
    process.exit(1);
}

console.log("\n--- summary ---");
console.log(`  documents seen:    ${stats.seen}`);
console.log(`  ${DRY_RUN ? "would update" : "updated"}:      ${stats.updated}`);
console.log(`  already migrated:  ${stats.alreadyMigrated}`);
console.log(`  skipped:           ${stats.skipped}`);
console.log(`  failed:            ${stats.failed}`);

if (dropped.length) {
    console.log("\nPermissions replaced with owner-only access on these documents:");
    for (const entry of dropped) {
        console.log(`  ${entry.id}: removed ${entry.permissions.join(", ")}`);
    }
}

if (!DRY_RUN && stats.updated > 0) {
    console.log(
        "\nNext: verify a resume loads in the app, then delete the `expirienceDetails`" +
        "\nattribute in the Appwrite console. Keep it until you have verified."
    );
}

process.exit(stats.failed > 0 ? 1 : 0);
