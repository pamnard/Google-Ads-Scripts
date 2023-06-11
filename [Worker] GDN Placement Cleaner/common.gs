/**
 * Converts a number of days to a GAQL-formatted date string.
 * @param {number} days - The number of days to subtract from the current date.
 * @returns {string} - A string in the format "yyyy-MM-dd", representing the number of days ago from the current date.
 */
function daysToGaqlDate(days) {
    const now = new Date();
    const targetDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return Utilities.formatDate(targetDate, "UTC", "yyyy-MM-dd");
}