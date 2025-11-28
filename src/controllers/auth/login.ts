import { IUser } from "@/models/user";
import { Request, Response } from "express";
import User from "@/models/user";
import { generateToken } from "@/lib/jwt";
import Token from "@/models/token";

type LoginData = Pick<IUser, "username" | "email" | "password">;


const login = async (request: Request, response: Response) => {
  try {
    const { username, email, password } = request.body as LoginData;
    if (!username && !email) {
      return response.status(400).json({
        code: "ValidationError",
        message: "Either username or email is required",
      });
    }
    const user = await User.findOne({ $or: [{ username, password }, { email, password }] });
    if (!user) {
      return response.status(400).json({
        code: "AuthenticationError",
        message: "Invalid username/email or password",
      })
    }
    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await Token.deleteOne({ userId: user._id });
    }
    token = await Token.create({
      userId: user._id,
      token: generateToken(user._id),
    })
    return response.status(200).json({
      message: "Login successful",
      token: token.token,
    })
  } catch (err) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "Internal server error occured, please try again later",
      error: err,
    });
  }
}

export default login;