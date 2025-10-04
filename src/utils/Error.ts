export class ApplicationException extends Error {
  statusCode: number;
  constructor(msg: string, statusCode: number, options?: ErrorOptions) {
    super(msg, options);
    this.statusCode = statusCode;
  }
}

export class validationError extends ApplicationException {
  constructor(msg: string[], statusCode: number, options?: ErrorOptions) {
    super(msg.join("\n"), statusCode, options);
  }
}

export class userExistError extends ApplicationException {
  constructor() {
    super("User already exists", 400);
  }
}

export class failedToCreateUser extends ApplicationException {
  constructor() {
    super("Failed to create user", 500);
  }
}

export class notFoundError extends ApplicationException {
  constructor() {
    super("Not Found", 404);
  }
}

export class failedToGenerateLink extends ApplicationException {
    constructor() {
        super("Failed to generate link", 500);
    }
}

export class userAlreadyConfirmedError extends ApplicationException {
  constructor() {
    super("User Already Confirmed", 400);
  }
}

export class otpExpiredError extends ApplicationException {
  constructor() {
    super("OTP Expired", 400);
  }
}

export class invalidCredentialsError extends ApplicationException {
  constructor() {
    super("Invalid Credentials", 400);
  }
}

export class otpNotExpiredError extends ApplicationException {
  constructor() {
    super("OTP Not Expired yet", 400);
  }
}

export class userNotConfirmedError extends ApplicationException {
  constructor() {
    super("User Not Confirmed", 400);
  }
}

export class invalidFileTypeError extends ApplicationException {
  constructor() {
    super("Invalid File Type", 400);
  }
}

export class fileSizeError extends ApplicationException {
  constructor() {
    super("File Size Exceeded", 400);
  }
}

export class failedToUpload extends ApplicationException {
    constructor() {
        super("Upload Failed", 500);
    }
}

export class unauthorizedError extends ApplicationException {
    constructor() {
        super("Unauthorized", 401);
    }
}
