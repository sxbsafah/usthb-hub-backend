import { hashPassword } from "@/lib/hash";
import User, { type IUser } from "@/models/user";
import type { Request, Response } from "express";
import Token from "@/models/token";
import { generateToken } from "@/lib/jwt";

type UserData = Pick<
  IUser,
  "email" | "password" | "firstName" | "lastName"
>;

const register = async (request: Request, response: Response) => {
  try {
    const { email, password, firstName, lastName } =
      request.body as UserData;
    const user = await User.create({
      password: await hashPassword(password),
      email,
      firstName,
      lastName,
    });
    const token = await Token.create({
      userId: user._id,
      token: generateToken(user._id),
    });
    return response.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: token.token,
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

export default register;
