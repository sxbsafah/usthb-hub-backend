import type { Request, Response } from "express";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";

type MetadataEntry = {
  subModuleId: string;
  resourceType: "td" | "tp" | "exam" | "course_material";
};

const updateContribution = async (request: Request, response: Response) => {
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
        message: "You can only update your own contributions",
      });
    }

    const { description } = request.body as { description?: string };
    if (description) {
      contribution.description = description;
      await contribution.save();
    }

    const uploaded = request.resources || [];
    if (uploaded.length > 0) {
      const metadataRaw = (request.body as { metadata?: string }).metadata;
      if (!metadataRaw) {
        return response.status(400).json({
          code: "ValidationError",
          message: "Metadata is required when uploading files",
        });
      }

      const metadata: MetadataEntry[] = JSON.parse(metadataRaw);
      if (metadata.length !== uploaded.length) {
        return response.status(400).json({
          code: "ValidationError",
          message: "Metadata count does not match uploaded files count",
        });
      }

      for (let i = 0; i < uploaded.length; i++) {
        const data = uploaded[i];
        const meta = metadata[i];
        await Resource.create({
          contributionId: contribution._id,
          subModuleId: meta.subModuleId,
          resourceType: meta.resourceType,
          publicId: data.public_id,
          file_url: data.secure_url,
          status: "pending",
        });
      }
    }

    return response.status(200).json({
      message: "Contribution updated successfully",
      contribution,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default updateContribution;
