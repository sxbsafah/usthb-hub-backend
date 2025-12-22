import type { Request, Response } from "express";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";

const getContributions = async (req: Request, response: Response) => {
  try {
    const contributions = await Contribution.find().populate("userId");

    // For each contribution, fetch its resources and populate subModuleOrModuleId
    const contributionsWithResources = await Promise.all(
      contributions.map(async (contribution) => {
        const resources = await Resource.find({
          contributionId: contribution._id,
        }).populate({ path: "subModuleOrModuleId" });
        return {
          ...contribution.toObject(),
          resources,
        };
      })
    );

    return response.status(200).json({
      message: "Contributions retrieved successfully",
      contributions: contributionsWithResources,
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
