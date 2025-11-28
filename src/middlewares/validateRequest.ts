import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";



const validateRequest = (request: Request, response: Response, next: NextFunction) => {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    return response.status(400).json({
      code: "ValidationError",
      message: "Invalid Request Data",
      errors: result.mapped(),
    })
  }
  next();
}

export default validateRequest;