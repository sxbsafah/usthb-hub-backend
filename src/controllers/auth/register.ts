import { hashPassword } from "@/lib/hash";
import User, { type IUser } from "@/models/user";
import type { Request, Response } from "express";

type UserData = Pick<
  IUser,
  "username" | "email" | "password" | "firstName" | "lastName"
>;

const register = async (request: Request, response: Response) => {
  try {
    const { username, email, password, firstName, lastName } =
      request.body as UserData;
    const user = await User.create({
      username,
      password: await hashPassword(password),
      email,
      firstName,
      lastName,
    });
    return response.status(201).json({
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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
