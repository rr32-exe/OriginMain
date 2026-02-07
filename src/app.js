/**
 * Application Core Module
 * 
 * This module contains the main application logic and functionality.
 */

const config = require('./config');
const utils = require('./utils');

class Application {
    constructor() {
        this.name = config.appName;
        this.version = config.version;
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.initialized) {
            console.log('⚠️  Application already initialized');
            return;
        }

        console.log(`📦 Initializing ${this.name} v${this.version}`);
        this.initialized = true;
    }

    /**
     * Run the main application logic
     */
    run() {
        this.init();
        
        console.log('🔧 Application running...');
        console.log(`⏰ Current time: ${utils.getCurrentTime()}`);
        console.log(`🆔 Session ID: ${utils.generateId()}`);
        
        // Main application logic goes here
        this.processData();
    }

    /**
     * Process application data
     */
    processData() {
        const sampleData = [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 2', value: 200 },
            { id: 3, name: 'Item 3', value: 300 }
        ];

        console.log('📊 Processing data...');
        const total = sampleData.reduce((sum, item) => sum + item.value, 0);
        console.log(`✨ Total value: ${total}`);
        console.log(`📈 Items processed: ${sampleData.length}`);
    }

    /**
     * Shutdown the application gracefully
     */
    shutdown() {
        console.log('🛑 Shutting down application...');
        this.initialized = false;
    }
}

// Export singleton instance
const app = new Application();

module.exports = {
    run: () => app.run(),
    shutdown: () => app.shutdown(),
    getInstance: () => app
};
