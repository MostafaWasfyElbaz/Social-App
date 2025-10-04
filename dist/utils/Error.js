"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorizedError = exports.failedToUpload = exports.fileSizeError = exports.invalidFileTypeError = exports.userNotConfirmedError = exports.otpNotExpiredError = exports.invalidCredentialsError = exports.otpExpiredError = exports.userAlreadyConfirmedError = exports.failedToGenerateLink = exports.notFoundError = exports.failedToCreateUser = exports.userExistError = exports.validationError = exports.ApplicationException = void 0;
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
class userExistError extends ApplicationException {
    constructor() {
        super("User already exists", 400);
    }
}
exports.userExistError = userExistError;
class failedToCreateUser extends ApplicationException {
    constructor() {
        super("Failed to create user", 500);
    }
}
exports.failedToCreateUser = failedToCreateUser;
class notFoundError extends ApplicationException {
    constructor() {
        super("Not Found", 404);
    }
}
exports.notFoundError = notFoundError;
class failedToGenerateLink extends ApplicationException {
    constructor() {
        super("Failed to generate link", 500);
    }
}
exports.failedToGenerateLink = failedToGenerateLink;
class userAlreadyConfirmedError extends ApplicationException {
    constructor() {
        super("User Already Confirmed", 400);
    }
}
exports.userAlreadyConfirmedError = userAlreadyConfirmedError;
class otpExpiredError extends ApplicationException {
    constructor() {
        super("OTP Expired", 400);
    }
}
exports.otpExpiredError = otpExpiredError;
class invalidCredentialsError extends ApplicationException {
    constructor() {
        super("Invalid Credentials", 400);
    }
}
exports.invalidCredentialsError = invalidCredentialsError;
class otpNotExpiredError extends ApplicationException {
    constructor() {
        super("OTP Not Expired yet", 400);
    }
}
exports.otpNotExpiredError = otpNotExpiredError;
class userNotConfirmedError extends ApplicationException {
    constructor() {
        super("User Not Confirmed", 400);
    }
}
exports.userNotConfirmedError = userNotConfirmedError;
class invalidFileTypeError extends ApplicationException {
    constructor() {
        super("Invalid File Type", 400);
    }
}
exports.invalidFileTypeError = invalidFileTypeError;
class fileSizeError extends ApplicationException {
    constructor() {
        super("File Size Exceeded", 400);
    }
}
exports.fileSizeError = fileSizeError;
class failedToUpload extends ApplicationException {
    constructor() {
        super("Upload Failed", 500);
    }
}
exports.failedToUpload = failedToUpload;
class unauthorizedError extends ApplicationException {
    constructor() {
        super("Unauthorized", 401);
    }
}
exports.unauthorizedError = unauthorizedError;
