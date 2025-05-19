import { app } from './app.js';
import connectDB from './database/mongoConnection.js';
import dotenv from 'dotenv';
import { loadCronJobs } from "./utils/cronUtils.js";

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("Connected to MongoDB");

        // Load cron jobs
        await loadCronJobs();
        console.log("Cron jobs loaded");

        // Start the server
        const PORT = process.env.PORT || 6000;
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});