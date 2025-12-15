export function validateUnitPayload(data: any) {
    if (!data.name || data.name.trim() === "") {
        return "Unit name is required";
    }

    if (!data.short_name || data.short_name.trim() === "") {
        return "Short name is required";
    }

    return null;
}
