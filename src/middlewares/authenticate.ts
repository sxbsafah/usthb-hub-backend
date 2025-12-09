import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/lib/jwt";
import { TokenExpiredError } from "jsonwebtoken";
import mongoose from "mongoose";
import Token from "@/models/token"


const authenticate =  (role: "user" | "admin") => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const tokenHeader = request.headers.authorization?.split(" ")[1];
      if (!tokenHeader) {
        return response.status(401).json({
          code: "AuthenticationError",
          message: "No token provided",
        })
      }
      const payload = verifyToken(tokenHeader) as { userId: mongoose.Types.ObjectId };
      const token = await Token.findOne({ userId: payload.userId, token: tokenHeader });
      if (!token) {
        return response.status(401).json({
          code: "AuthenticationError",
          message: "No Token Found, User might be logged out",
        })
      }
      if (role === "admin") {
        const user = await Token.findOne({ userId: payload.userId }).populate("userId");
        if (!user || (user.userId as unknown as { role: string }).role !== "admin") {
          return response.status(403).json({
            code: "AuthorizationError",
            message: "You do not have permission to access this resource",
          })
        }
      }
      request.userId = payload.userId;
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return response.status(401).json({
          code: "AuthenticationError",
          message: "Token has expired, Please login again",
        })
      }
      return response.status(401).json({
        code: "AuthenticationError",
        message: "Invalid token",
    
      })
    }
  }
}

export default authenticate;