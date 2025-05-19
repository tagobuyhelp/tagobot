import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    res.status(200).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).select('-password');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json({ success: true, data: {} });
});

export {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};