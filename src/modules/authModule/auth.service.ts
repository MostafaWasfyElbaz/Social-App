import { Request, Response, NextFunction } from "express";

interface IAuthServices {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
}

class AuthServices implements IAuthServices {
  constructor() {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    
  }
}

export default AuthServices;
