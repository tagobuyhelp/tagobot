import { Credential } from '../models/credential.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

export const getCredentials = asyncHandler(async (req, res) => {
    try {
        const credentials = await Credential.find().select('-apiKey -accessToken');
        res.status(200).json(new ApiResponse(200, credentials, 'All credentials retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, 'Error retrieving credentials', error.message);
    }
});

export const getCredentialById = asyncHandler(async (req, res) => {
    try {
        const credential = await Credential.findById(req.params.id).select('-apiKey -accessToken');
        if (!credential) {
            throw new ApiError(404, 'Credential not found');
        }
        res.status(200).json(new ApiResponse(200, credential, 'Credential retrieved successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid credential ID');
        }
        throw error;
    }
});

export const createCredential = asyncHandler(async (req, res) => {
    try {
        const credential = new Credential(req.body);
        await credential.save();
        res.status(201).json(new ApiResponse(201, credential, 'Credential created successfully'));
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new ApiError(400, 'Validation Error', messages);
        }
        throw new ApiError(500, 'Error creating credential', error.message);
    }
});

export const updateCredential = asyncHandler(async (req, res) => {
    try {
        const credential = await Credential.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-apiKey -accessToken');
        if (!credential) {
            throw new ApiError(404, 'Credential not found');
        }
        res.status(200).json(new ApiResponse(200, credential, 'Credential updated successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid credential ID');
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new ApiError(400, 'Validation Error', messages);
        }
        throw new ApiError(500, 'Error updating credential', error.message);
    }
});

export const deleteCredential = asyncHandler(async (req, res) => {
    try {
        const credential = await Credential.findByIdAndDelete(req.params.id);
        if (!credential) {
            throw new ApiError(404, 'Credential not found');
        }
        res.status(200).json(new ApiResponse(200, null, 'Credential deleted successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid credential ID');
        }
        throw new ApiError(500, 'Error deleting credential', error.message);
    }
});