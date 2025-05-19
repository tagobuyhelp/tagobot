import { Service } from '../models/service.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

// Create a new service
export const createService = asyncHandler(async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(new ApiResponse(201, service, 'Service created successfully'));
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new ApiError(400, 'Validation Error', messages);
        }
        throw new ApiError(500, 'Error creating service', error.message);
    }
});

// Get all services
export const getServices = asyncHandler(async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(new ApiResponse(200, services, 'All services retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, 'Error retrieving services', error.message);
    }
});

// Get a single service by ID
export const getServiceById = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            throw new ApiError(404, 'Service not found');
        }
        res.status(200).json(new ApiResponse(200, service, 'Service retrieved successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid service ID');
        }
        throw error;
    }
});

// Update a service
export const updateService = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!service) {
            throw new ApiError(404, 'Service not found');
        }
        res.status(200).json(new ApiResponse(200, service, 'Service updated successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid service ID');
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new ApiError(400, 'Validation Error', messages);
        }
        throw new ApiError(500, 'Error updating service', error.message);
    }
});

// Delete a service
export const deleteService = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            throw new ApiError(404, 'Service not found');
        }
        res.status(200).json(new ApiResponse(200, null, 'Service deleted successfully'));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid service ID');
        }
        throw new ApiError(500, 'Error deleting service', error.message);
    }
});

// Toggle service status (active/inactive)
export const toggleServiceStatus = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            throw new ApiError(404, 'Service not found');
        }
        service.isActive = !service.isActive;
        await service.save();
        res.status(200).json(new ApiResponse(200, service, `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`));
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new ApiError(400, 'Invalid service ID');
        }
        throw new ApiError(500, 'Error toggling service status', error.message);
    }
});