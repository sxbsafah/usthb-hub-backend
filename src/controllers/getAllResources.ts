import type { Request, Response } from "express";
import Resource from "@/models/resource";

const getAllResources = async (request: Request, response: Response) => {
  try {
    const resources = await Resource.find()
      .populate("contributionId", "description")
      .populate("subModuleId", "name");

    return response.status(200).json({
      message: "Resources retrieved successfully",
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

export default getAllResources;
