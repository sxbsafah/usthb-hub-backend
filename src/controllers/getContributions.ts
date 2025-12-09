import type { Request, Response } from "express";
import Contribution from "@/models/contribution";

const getContributions = async (req: Request, response: Response) => {
  try {
    const contributions = await Contribution.find()
      .populate("userId", "name email")
      .populate("resources");

    return response.status(200).json({
      message: "Contributions retrieved successfully",
      contributions: contributions,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getContributions;
