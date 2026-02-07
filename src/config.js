/**
 * Application Configuration
 * 
 * Central configuration for the application
 */

module.exports = {
    appName: 'OriginMain',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    
    // Add more configuration options as needed
    settings: {
        debug: process.env.DEBUG === 'true',
        logLevel: process.env.LOG_LEVEL || 'info'
    }
};
