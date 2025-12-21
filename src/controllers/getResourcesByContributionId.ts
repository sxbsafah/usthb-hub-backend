import type { Request, Response } from "express";
import Resource from "@/models/resource";
import Contribution from "@/models/contribution";

const getResourcesByContributionId = async (
  request: Request,
  response: Response
) => {
  try {
    const { contributionId } = request.params;

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return response.status(404).json({
        code: "NotFound",
        message: "Contribution not found",
      });
    }

    const resources = await Resource.find({ contributionId: contributionId })
      .populate("subModuleOrModuleId", "name")
      .sort({ createdAt: -1 });

    return response.status(200).json({
      message: "Resources retrieved successfully",
      contribution: {
        id: contribution._id,
        description: contribution.description,
        userId: contribution.userId,
      },
      resources: resources,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getResourcesByContributionId;
