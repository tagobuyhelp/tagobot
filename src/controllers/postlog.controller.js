import { PostLog } from '../models/postlog.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

export const getPostLogs = asyncHandler(async (req, res) => {
    try {
        const postLogs = await PostLog.find().populate('service');
        res.status(200).json(new ApiResponse(200, postLogs, 'All post logs retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, 'Error retrieving post logs', error.message);
    }
});

export const getPostLogById = asyncHandler(async (req, res) => {
    try {
        const postLog = await PostLog.findById(req.params.id).populate('service');
        if (!postLog) {
            throw new ApiError(404, 'Post log not found');
        }
        res.status(200).json(new ApiResponse(200, postLog, 'Post log retrieved successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid post log ID');
        }
        throw error;
    }
});

export const createPostLog = asyncHandler(async (req, res) => {
    try {
        const postLog = new PostLog(req.body);
        await postLog.save();
        res.status(201).json(new ApiResponse(201, postLog, 'Post log created successfully'));
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new ApiError(400, 'Validation Error', messages);
        }
        throw new ApiError(500, 'Error creating post log', error.message);
    }
});
