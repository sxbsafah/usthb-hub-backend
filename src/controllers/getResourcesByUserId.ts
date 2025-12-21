import type { Request, Response } from "express";
import Resource from "@/models/resource";
import User from "@/models/user";

const getResourcesByUserId = async (request: Request, response: Response) => {
  try {
    const { userId } = request.params;

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({
        code: "NotFound",
        message: "User not found",
      });
    }

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
      message: "Resources retrieved successfully",
      user: {
        id: user._id,
        email: user.email,
      },
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

export default getResourcesByUserId;
