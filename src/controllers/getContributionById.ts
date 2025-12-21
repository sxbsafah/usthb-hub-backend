import type { Request, Response } from "express";
import Contribution from "@/models/contribution";

const getContributionById = async (req: Request, response: Response) => {
  try {
    const { id } = req.params;

    const contribution = await Contribution.findById(id)
      .populate("userId")
      .populate("resources");

    if (!contribution) {
      return response.status(404).json({
        code: "NotFound",
        message: "Contribution not found",
      });
    }

    return response.status(200).json({
      message: "Contribution retrieved successfully",
      contribution: contribution,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getContributionById;
