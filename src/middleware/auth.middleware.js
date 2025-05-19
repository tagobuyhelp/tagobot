import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Not authorized to access this route');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        throw new ApiError(401, 'Not authorized to access this route');
    }
});

export const authorize = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(req.user.role);
            throw new ApiError(403, `User role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};