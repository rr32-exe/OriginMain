/**
 * OriginMain - Main Entry Point
 * 
 * This is the main entry point for the OriginMain application.
 * A fully-featured Node.js application structure.
 */

const app = require('./src/app');

// Start the application
function main() {
    console.log('🚀 OriginMain Application Starting...');
    
    try {
        app.run();
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Application failed to start:', error.message);
        process.exit(1);
    }
}

// Run the application
if (require.main === module) {
    main();
}

module.exports = { main };
may come accross