import config from "@/config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const generateToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ userId }, config.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
};
