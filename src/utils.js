/**
 * Utility Functions
 * 
 * Common utility functions used throughout the application
 */

/**
 * Get current timestamp as formatted string
 * @returns {string} Formatted timestamp
 */
function getCurrentTime() {
    return new Date().toISOString();
}

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Format data as JSON string
 * @param {*} data - Data to format
 * @param {number} indent - Indentation level
 * @returns {string} Formatted JSON string
 */
function formatJson(data, indent = 2) {
    return JSON.stringify(data, null, indent);
}

/**
 * Safely parse JSON string
 * @param {string} jsonString - JSON string to parse
 * @returns {*} Parsed object or null if invalid
 */
function safeJsonParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse JSON:', error.message);
        return null;
    }
}

module.exports = {
    getCurrentTime,
    generateId,
    formatJson,
    safeJsonParse
};
