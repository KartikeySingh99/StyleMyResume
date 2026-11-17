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

const stats = { seen: 0, updated: 0, alreadyMigrated: 0, skipped: 0, failed: 0 };
const dropped = [];

console.log(DRY_RUN ? "DRY RUN — no writes will be made\n" : "Applying migration\n");

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
