import type { Request, Response } from "express";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";

const getMyContributions = async (request: Request, response: Response) => {
  try {
    const userId = request.userId;

    const contributions = await Contribution.find({ userId: userId })
      .populate("userId")
      .sort({ createdAt: -1 });
    if (!contributions || contributions.length === 0) {
      return response.status(200).json({
        message: "You have no contributions yet",
        contributions: [],
      });
    }

    const contributionsWithResources = await Promise.all(
      contributions.map(async (contribution) => {
        const resources = await Resource.find({
          contributionId: contribution._id,
        }).populate("subModuleOrModuleId", "name");

        // Fallback: if subModuleOrModuleId is null, fetch manually
        const resourcesWithNames = await Promise.all(
          resources.map(async (resource) => {
            let subModuleOrModuleName = null;
            if (
              !resource.subModuleOrModuleId &&
              resource.subModuleOrModuleType &&
              resource.subModuleOrModuleId
            ) {
              // Defensive: should not happen, but just in case
              return resource;
            }
            if (!resource.subModuleOrModuleId) {
              // Try to fetch manually
              if (resource.subModuleOrModuleType === "Module") {
                const module = await require("@/models/module")
                  .default.findById(resource.subModuleOrModuleId)
                  .select("name");
                subModuleOrModuleName = module ? module.name : null;
              } else if (resource.subModuleOrModuleType === "SubModule") {
                const subModule = await require("@/models/subModule")
                  .default.findById(resource.subModuleOrModuleId)
                  .select("name");
                subModuleOrModuleName = subModule ? subModule.name : null;
              }
            } else if (
              resource.subModuleOrModuleId &&
              typeof resource.subModuleOrModuleId === "object" &&
              !(
                typeof resource.subModuleOrModuleId._bsontype === "string" &&
                resource.subModuleOrModuleId._bsontype === "ObjectId"
              ) &&
              "name" in resource.subModuleOrModuleId
            ) {
              // Only access .name if not a plain ObjectId
              subModuleOrModuleName = (resource.subModuleOrModuleId as any)
                .name;
            }
            return {
              ...resource.toObject(),
              subModuleOrModuleName,
            };
          })
        );
        return {
          ...(await contribution.populate("userId")).toObject(),
          resources: resourcesWithNames,
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
