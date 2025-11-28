import { Request, Response } from "express";
import Token from "@/models/token";


const logout = async (request: Request, response: Response) => {
  try {
    const { userId } = request;
    await Token.deleteOne({ userId });
    return response.status(200).json({
      message: "Logout successful",
    })
  } catch (err) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "Internal server error occured, please try again later",
      error: err,
    })
  }
}

export default logout;
