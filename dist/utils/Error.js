"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    statusCode;
    constructor(msg, statusCode, options) {
        super(msg, options);
        this.statusCode = statusCode;
    }
}
exports.ApplicationException = ApplicationException;
class validationError extends ApplicationException {
    constructor(msg, statusCode, options) {
        super(msg.join("\n"), statusCode, options);
    }
}
exports.validationError = validationError;
