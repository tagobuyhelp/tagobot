import cron from "node-cron";
import { Schedule } from "../models/schedule.model.js";
import { Service } from "../models/service.model.js";
import { generateAndPostContent } from "./postHandler.js";
import moment from "moment-timezone";
import mongoose from "mongoose";

// Map to store active cron tasks
const cronTasks = new Map();

export const loadCronJobs = async () => {
    try {
        // Check if the database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log("Database not connected. Waiting for connection...");
            await new Promise(resolve => {
                mongoose.connection.once('connected', resolve);
            });
            console.log("Database connected. Proceeding with cron job loading.");
        }

        // Clear existing tasks
        for (const task of cronTasks.values()) {
            task.stop();
        }
        cronTasks.clear();

        // Load all schedules with services
        const schedules = await Schedule.find({ isEnabled: true }).populate("service");

        if (schedules.length === 0) {
            console.log("No active schedules found.");
            return;
        }

        schedules.forEach((schedule) => {
            const { time, days, timezone, service } = schedule;
            if (!service || !service.isActive) {
                console.log(`Skipping inactive service: ${service ? service.name : 'Unknown'}`);
                return;
            }

            const [hour, minute] = time.split(":").map(Number);

            days.forEach((day) => {
                const dayIndex = [
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                ].indexOf(day);

                const cronExpression = `${minute} ${hour} * * ${dayIndex}`;

                const task = cron.schedule(cronExpression, async () => {
                    const currentTime = moment().tz(timezone).format("HH:mm");
                    console.log(`⏱️ Running scheduled task for ${service.name} at ${currentTime}`);

                    try {
                        await generateAndPostContent(service);
                    } catch (error) {
                        console.error(`Error generating/posting content for ${service.name}:`, error);
                    }
                }, {
                    timezone,
                });

                // Store task to cancel/reload later
                cronTasks.set(`${service._id}-${day}`, task);
                console.log(`Scheduled task for ${service.name} on ${day} at ${time} (${timezone})`);
            });
        });

        console.log(`✅ All cron jobs loaded. Total active jobs: ${cronTasks.size}`);
    } catch (error) {
        console.error("Error loading cron jobs:", error);
    }
};