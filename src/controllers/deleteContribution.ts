import type { Request, Response } from "express";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";
import { v2 as cloudinary } from "cloudinary";

const deleteContribution = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return response.status(404).json({
        code: "NotFound",
        message: "Contribution not found",
      });
    }

    if (contribution.userId.toString() !== request.userId?.toString()) {
      return response.status(403).json({
        code: "Forbidden",
        message: "You can only delete your own contributions",
      });
    }

    const resources = await Resource.find({ contributionId: id });

    for (const resource of resources) {
      try {
        await cloudinary.uploader.destroy(resource.publicId);
      } catch (error) {
        console.error(
          `Failed to delete file from Cloudinary: ${resource.publicId}`,
          error
        );
      }
    }

    await Resource.deleteMany({ contributionId: id });

    await contribution.deleteOne();

    return response.status(200).json({
      message: "Contribution deleted successfully",
      deletedResources: resources.length,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default deleteContribution;
