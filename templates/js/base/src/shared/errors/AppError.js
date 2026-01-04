import { StatusCodes } from 'http-status-codes';
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
