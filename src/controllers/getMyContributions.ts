import type { Request, Response } from "express";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";

const getMyContributions = async (request: Request, response: Response) => {
  try {
    const userId = request.userId;

    const contributions = await Contribution.find({ userId: userId })
      .populate("userId")
      .sort({ createdAt: -1 });

    const contributionsWithResources = await Promise.all(
      contributions.map(async (contribution) => {
        const resources = await Resource.find({
          contributionId: contribution._id,
        }).populate("subModuleOrModuleId", "name");

        return {
          ...(await contribution.populate("userId")).toObject(),
          resources: resources,
        };
      })
    );

    return response.status(200).json({
      message: "Your contributions retrieved successfully",
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

export default getMyContributions;
