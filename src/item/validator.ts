// src/item/item.validator.ts
export function validateItemPayload(body: any): string | null {
    if (!body) return "Request body is required";
    if (!body.name || body.name.toString().trim() === "") return "name is required";
    if (!body.category || body.category.toString().trim() === "") return "category is required";
    if (!body.unit || body.unit.toString().trim() === "") return "unit is required";
    if (body.price === undefined || body.price === null || isNaN(Number(body.price))) return "price is required and must be number";
    return null;
}
  