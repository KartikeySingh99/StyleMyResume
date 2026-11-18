export const OWNER_ATTRIBUTE = "User_ID";
export const DEFAULT_RESUME_TITLE = "My Resume";

/** Values that mean "this section was never filled in". */
const isBlankSection = (value) => {
    if (value === null || value === undefined) return true;
    const trimmed = String(value).trim();
    return trimmed === "" || trimmed === "[]" || trimmed === "{}" || trimmed === "null";
};

/**
 * In the old model the document id *was* the Appwrite user id, so documents
 * missing an explicit owner attribute can recover it from `$id`.
 */
export const resolveOwnerId = (document = {}) =>
    document[OWNER_ATTRIBUTE] || document.$id || null;

export const requiredPermissions = (ownerId) => [
    `read("user:${ownerId}")`,
    `update("user:${ownerId}")`,
    `delete("user:${ownerId}")`,
];

/**
 * Works out what a single document needs, without touching the network.
 *
 * Returns { ownerId, data, permissions, droppedPermissions, reasons, needsUpdate }.
 * Idempotent: a document already migrated yields needsUpdate === false.
 */
export const planDocumentUpdate = (document = {}) => {
    const ownerId = resolveOwnerId(document);
    const reasons = [];
    const data = {};

    if (!ownerId) {
        return {
            ownerId: null,
            data: {},
            permissions: [],
            droppedPermissions: [],
            reasons: ["no owner id — cannot migrate"],
            needsUpdate: false,
            skipped: true,
        };
    }

    // 1. Backfill the corrected attribute spelling.
    if (isBlankSection(document.experienceDetails) && !isBlankSection(document.expirienceDetails)) {
        data.experienceDetails = document.expirienceDetails;
        reasons.push("copy expirienceDetails -> experienceDetails");
    }

    // 2. Older documents relied on the document id to identify the owner.
    if (!document[OWNER_ATTRIBUTE]) {
        data[OWNER_ATTRIBUTE] = ownerId;
        reasons.push(`set ${OWNER_ATTRIBUTE} from $id`);
    }

    // 3. Resumes are now named, so a picker can tell them apart.
    if (!String(document.title ?? "").trim()) {
        data.title = DEFAULT_RESUME_TITLE;
        reasons.push("set default title");
    }

    // 4. Document-level permissions for the owner. Documents created before the
    //    security fix have none and fall back to collection-level rules.
    const existing = Array.isArray(document.$permissions) ? document.$permissions : [];
    const required = requiredPermissions(ownerId);
    const missing = required.filter((permission) => !existing.includes(permission));
    const droppedPermissions = existing.filter((permission) => !required.includes(permission));

    let permissions = null;
    if (missing.length || droppedPermissions.length) {
        permissions = required;
        if (missing.length) reasons.push(`add permissions: ${missing.join(", ")}`);
        if (droppedPermissions.length) reasons.push(`drop permissions: ${droppedPermissions.join(", ")}`);
    }

    return {
        ownerId,
        data,
        permissions,
        droppedPermissions,
        reasons,
        needsUpdate: Object.keys(data).length > 0 || permissions !== null,
        skipped: false,
    };
};
