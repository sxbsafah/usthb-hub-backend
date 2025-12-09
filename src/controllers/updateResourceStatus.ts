import type { Request, Response } from "express";
import Resource from "@/models/resource";

const updateResourceStatus = async (request: Request, response: Response) => {
  try {
    const { resourceId } = request.params;
    const { status } = request.body as { status: "approved" | "rejected" };

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return response.status(404).json({
        code: "NotFound",
        message: "Resource not found",
      });
    }

    resource.status = status;
    await resource.save();

    return response.status(200).json({
      message: `Resource ${status} successfully`,
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

export default updateResourceStatus;
