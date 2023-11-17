export default function getMDY(): Date {
    const date = new Date();
    const month = (date.getUTCMonth()).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return new Date(year, +month, +day);
}