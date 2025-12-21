import type { Request, Response } from "express";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";

const getPendingContributions = async (
  request: Request,
  response: Response
) => {
  try {
    const pendingResources = await Resource.find({ status: "pending" })
      .populate("contributionId")
      .populate("subModuleId", "name");

    const contributionsMap = new Map();

    for (const resource of pendingResources) {
      const contribution = resource.contributionId as any;
      const contributionId = contribution._id.toString();

      if (!contributionsMap.has(contributionId)) {
        const fullContribution = await Contribution.findById(
          contributionId
        ).populate("userId", "email");
        contributionsMap.set(contributionId, {
          contribution: fullContribution,
          resources: [],
        });
      }
      contributionsMap.get(contributionId).resources.push(resource);
    }

    const pendingContributions = Array.from(contributionsMap.values());

    return response.status(200).json({
      message: "Pending contributions retrieved successfully",
      count: pendingContributions.length,
      contributions: pendingContributions,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getPendingContributions;
