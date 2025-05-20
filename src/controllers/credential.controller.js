import { Credential } from '../models/credential.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

export const getCredentials = asyncHandler(async (req, res) => {
    try {
        const credentials = await Credential.find({ user: req.user._id }).populate('platform').select('-config');
        res.status(200).json(new ApiResponse(200, credentials, 'All credentials retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, 'Error retrieving credentials', error.message);
    }
});

export const getCredentialById = asyncHandler(async (req, res) => {
    try {
        const credential = await Credential.findOne({ _id: req.params.id, user: req.user._id }).populate('platform').select('-config');
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
        const credential = new Credential({
            ...req.body,
            user: req.user._id
        });
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
        const { platform, label, config, isActive, notes } = req.body;
        const credential = await Credential.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { platform, label, config, isActive, notes },
            { new: true, runValidators: true }
        ).populate('platform').select('-config');
        
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
        const credential = await Credential.findOneAndDelete({ _id: req.params.id, user: req.user._id });
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