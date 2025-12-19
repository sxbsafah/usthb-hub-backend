import { IUser } from "@/models/user";
import { Request, Response } from "express";
import User from "@/models/user";
import { generateToken } from "@/lib/jwt";
import Token from "@/models/token";
import { comparePassword } from "@/lib/hash";

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
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user || !(await comparePassword(password, user.password))) {
      return response.status(400).json({
        code: "AuthenticationError",
        message: "Invalid username/email or password",
      });
    }
    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await Token.deleteOne({ userId: user._id });
    }
    token = await Token.create({
      userId: user._id,
      token: generateToken(user._id),
    });
    return response.status(200).json({
      message: "Login successful",
      user: {
        token: token.token,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "Internal server error occured, please try again later",
      error: err,
    });
  }
};

export default login;
