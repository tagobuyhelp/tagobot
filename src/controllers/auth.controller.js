import { User } from '../models/user.model.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import mongoose from 'mongoose';

// Register user
export const register = asyncHandler(async (req, res) => {
    const { email, password, role, phone, name, visitorType } = req.body;
    console.log(email, password, role, phone, name);

    // Define allowed roles
    const allowedRoles = ['administrator', 'admin', 'editor', 'visitor', 'agent'];

    // Check if the role is valid
    if (!allowedRoles.includes(role)) {
        throw new ApiError(400, 'Invalid role');
    }

    // Check if the user making the request is an administrator or admin
    if (req.user && !['administrator', 'admin'].includes(req.user.role)) {
        throw new ApiError(403, 'Only administrators and admins can create new users');
    }

    // If no user is authenticated (i.e., during initial setup), allow the creation of the first administrator
    if (!req.user && role === 'administrator') {
        const administratorCount = await User.countDocuments({ role: 'administrator' });
        if (administratorCount > 0) {
            throw new ApiError(403, 'Administrator already exists. Only existing administrators can create new users');
        }
    }

    // Additional checks based on roles
    if (req.user) {
        if (req.user.role === 'admin' && role === 'administrator') {
            throw new ApiError(403, 'Admins cannot create administrator accounts');
        }
        if (req.user.role === 'admin' && role === 'admin') {
            throw new ApiError(403, 'Admins cannot create other admin accounts');
        }
    }

    // If the role is 'visitor' or 'agent', create the corresponding entry
    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create user
        const user = await User.create([{
            name,
            email,
            password,
            role,
            phone
        }], { session });

        // Commit the transaction
        await session.commitTransaction();

        // End the session
        session.endSession();

        // Send welcome email
        await sendEmail({
            email: user[0].email,
            subject: 'Welcome to Our Platform',
            message: `Hello ${user[0].name}, welcome to our platform! Your account has been successfully created.`
        });

        // Send token response
        sendTokenResponse(user[0], 201, res);
    } catch (error) {
        // If an error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// Login user
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        throw new ApiError(400, 'Please provide an email and password');
    }

    // Find the user and include the password field for validation
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Validate the password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Construct user profile excluding the password
    const userProfile = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
    };

    // Generate token and send response
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(200)
        .cookie('token', token, options)
        .json({
            statusCode: 200,
            data: {
                token,
                userProfile,
            },
            message: 'User logged in successfully',
            success: true,
        });
});


// Forgot password
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        throw new ApiError(404, 'There is no user with that email');
    }

    // Generate OTP
    const otp = user.getResetPasswordOtp();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Your OTP is: ${otp}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset OTP',
            message,
        });

        res.status(200).json(new ApiResponse(200, {}, 'OTP sent to email'));
    } catch (err) {
        console.log(err);
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        throw new ApiError(500, 'Email could not be sent');
    }
});

// Reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed OTP
    const resetPasswordOtp = crypto
        .createHash('sha256')
        .update(req.body.otp)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordOtp,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// Delete user
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Check if the user is trying to delete their own account
    if (user._id.toString() !== req.user.id) {
        throw new ApiError(401, 'You can only delete your own account');
    }

    await user.remove();

    res.status(200).json(new ApiResponse(200, {}, 'User deleted successfully'));
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    if (!token) {
        throw new ApiError(500, 'Failed to generate token');
    }

    const options = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    const userProfile = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
    };
    
    // Response
    res.status(200).json({
        statusCode: 200,
        data: {
            token,
            userProfile,
        },
        message: "User logged in successfully",
        success: true,
    });
};