import { Platform } from '../models/platform.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Get all platforms
export const getPlatforms = asyncHandler(async (req, res) => {
    const platforms = await Platform.find();

    res.status(200).json(
        new ApiResponse(200, platforms, "Platforms retrieved successfully")
    );
});

// Get a single platform by name
export const getPlatform = asyncHandler(async (req, res) => {
    const platform = await Platform.findOne({ name: req.params.name });

    if (!platform) {
        throw new ApiError(404, "Platform not found");
    }

    res.status(200).json(
        new ApiResponse(200, platform, "Platform retrieved successfully")
    );
});