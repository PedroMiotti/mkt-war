"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// centralized error object that derives from Node’s Error
class AppError extends Error {
    constructor(name, httpCode, description, isOperational) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=appError.js.map