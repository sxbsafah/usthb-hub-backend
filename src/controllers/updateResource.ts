import type { Request, Response } from "express";
import Resource from "@/models/resource";
import Contribution from "@/models/contribution";

const updateResource = async (request: Request, response: Response) => {
  try {
    const { resourceId } = request.params;

    const resource = await Resource.findById(resourceId).populate(
      "contributionId"
    );
    if (!resource) {
      return response.status(404).json({
        code: "NotFound",
        message: "Resource not found",
      });
    }

    const contribution = await Contribution.findById(resource.contributionId);
    if (
      !contribution ||
      contribution.userId.toString() !== request.userId?.toString()
    ) {
      return response.status(403).json({
        code: "Forbidden",
        message: "You can only update resources from your own contributions",
      });
    }

    if (!request.resources || request.resources.length === 0) {
      return response.status(400).json({
        code: "ValidationError",
        message: "No file provided for update",
      });
    }

    const { resourceType, subModuleId } = request.body;

    resource.file_url = request.resources[0].secure_url;
    resource.publicId = request.resources[0].public_id;
    resource.status = "pending";
    if (resourceType) {
      resource.resourceType = resourceType;
    }
    if (subModuleId) {
      resource.subModuleId = subModuleId;
    }
    await resource.save();

    return response.status(200).json({
      message: "Resource updated successfully",
      resource: resource,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default updateResource;
