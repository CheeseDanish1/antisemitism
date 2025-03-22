export const generateSlug = (title) => {
    if (!title) return "";
    return title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
};