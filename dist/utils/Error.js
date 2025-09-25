"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNotConfirmedError = exports.otpNotExpiredError = exports.invalidCredentialsError = exports.otpExpiredError = exports.userAlreadyConfirmedError = exports.userNotFoundError = exports.notFoundError = exports.failedToCreateUser = exports.userExistError = exports.validationError = exports.ApplicationException = void 0;
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
        super("Page Not Found", 404);
    }
}
exports.notFoundError = notFoundError;
class userNotFoundError extends ApplicationException {
    constructor() {
        super("User Not Found", 404);
    }
}
exports.userNotFoundError = userNotFoundError;
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
