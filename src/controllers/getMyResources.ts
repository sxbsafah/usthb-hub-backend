import type { Request, Response } from "express";
import Resource from "@/models/resource";

const getMyResources = async (request: Request, response: Response) => {
  try {
    const userId = request.userId;

    const resources = await Resource.find()
      .populate({
        path: "contributionId",
        match: { userId: userId },
        select: "description userId",
      })
      .populate("subModuleOrModuleId", "name")
      .sort({ createdAt: -1 });

    const userResources = resources.filter(
      (resource) => resource.contributionId !== null
    );

    return response.status(200).json({
      message: "Your resources retrieved successfully",
      resources: userResources,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getMyResources;
