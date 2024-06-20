

export function formatDate (date) {
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
}