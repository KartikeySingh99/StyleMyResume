/**
 * Splits a multi line field (responsibilities, descriptions) into bullet points.
 * Tolerates undefined/null/non-string values, which previously crashed the
 * templates and the profile page with "Cannot read properties of undefined".
 */
export const toLines = (value) =>
    String(value ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

/** Drops rows where every value is blank (e.g. an "Add more" row never filled in). */
export const dropEmptyRows = (rows) =>
    (Array.isArray(rows) ? rows : []).filter((row) =>
        Object.values(row ?? {}).some((value) => String(value ?? "").trim() !== "")
    );

/**
 * Returns the name of the first required field left blank, or null when valid.
 * Validation is driven by the same field definitions used to render the form.
 */
export const findMissingRequiredField = (rows, fields) => {
    for (const row of Array.isArray(rows) ? rows : []) {
        for (const field of fields ?? []) {
            if (field.isRequired && !String(row?.[field.name] ?? "").trim()) {
                return field.name;
            }
        }
    }
    return null;
};
