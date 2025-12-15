export function validateRegister(body: any): string | null {
    if (!body.username) return "Name is required";
    if (!body.email) return "Email is required";
    if (!body.password) return "Password is required";
    return null;
}

export function validateLogin(body: any): string | null {
    if (!body.username) return "Name is required";
    // if (!body.email) return "Email is required";
    if (!body.password) return "Password is required";
    return null;
}
