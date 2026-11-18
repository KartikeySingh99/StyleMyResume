/**
 * Groups flat skill rows ({ Skill, skillType }) into { [type]: skill[] }.
 * Shared by the profile page and every template, and tolerates missing or
 * half-filled rows — `skillDetails.forEach` used to throw when undefined.
 */
export const groupSkills = (skills) =>
    (Array.isArray(skills) ? skills : []).reduce((grouped, row) => {
        const skill = String(row?.Skill ?? "").trim();
        if (!skill) return grouped;
        const group = String(row?.skillType ?? "").trim() || "Other";
        grouped[group] = grouped[group] ?? [];
        grouped[group].push(skill);
        return grouped;
    }, {});

export default groupSkills;
