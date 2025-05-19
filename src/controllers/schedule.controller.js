import { Schedule } from '../models/schedule.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

export const getSchedules = asyncHandler(async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('service');
        res.status(200).json(new ApiResponse(200, schedules, 'All schedules retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, 'Error retrieving schedules', error.message);
    }
});

export const getScheduleById = asyncHandler(async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate('service');
        if (!schedule) {
            throw new ApiError(404, 'Schedule not found');
        }
        res.status(200).json(new ApiResponse(200, schedule, 'Schedule retrieved successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid schedule ID');
        }
        throw error;
    }
});

export const getScheduleByService = asyncHandler(async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ service: req.params.serviceId }).populate('service');
        if (!schedule) {
            throw new ApiError(404, 'Schedule not found for this service');
        }
        res.status(200).json(new ApiResponse(200, schedule, 'Schedule retrieved successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid service ID');
        }
        throw error;
    }
});
