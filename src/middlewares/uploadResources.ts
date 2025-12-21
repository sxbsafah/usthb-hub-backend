import { Request, Response, NextFunction } from "express";
import path from "path";
import uploadToCloudinary from "@/lib/cloudinary";
import { z } from "zod";
import SubModule from "@/models/subModule";
import Resource from "@/models/resource";

const metadataSchema = z.array(
  z.object({
    resourceType: z.enum(
      ["td", "tp", "exam", "course_material"],
      "Invalid resource type"
    ),
    subModuleOrModuleId: z.string(),
    subModuleOrModuleType: z.enum(["SubModule", "Module"], "Invalid type"),
  }),
  "metadata must be an array of objects with resourceType, subModuleOrModuleId, and subModuleOrModuleType"
);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const uploadResources = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { resourceId } = request.params;

  if (resourceId) {
    if (!request.file) {
      return response.status(400).json({
        code: "ValidationError",
        message: "No file provided for resource update",
      });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return response.status(404).json({
        code: "NotFound",
        message: "Resource not found",
      });
    }

    const file = request.file;
    if (file.size > MAX_FILE_SIZE) {
      return response.status(413).json({
        code: "validationError",
        message: `File exceeds the maximum allowed size of 25MB`,
      });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf" && ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png") {
      return response.status(415).json({
        code: "ValidationError",
        message: `File has an unsupported format. Only PDF and image files are allowed.`,
      });
    }

    try {
      const data = await uploadToCloudinary(file.buffer, resource.publicId);
      if (!data) {
        return response.status(500).json({
          code: "InternalServerError",
          message: `Failed to upload file, please try again later.`,
        });
      }
      request.resources = [data];
      return next();
    } catch (error) {
      return response.status(500).json({
        code: "InternalServerError",
        message: `An error occurred while uploading file, please try again later.`,
        err: error,
      });
    }
  }

  if (request.method === "PUT" && !request.files) {
    return next();
  }

  if (!request.files) {
    return response.status(400).json({
      code: "ValidationError",
      message: "No files were uploaded",
    });
  }

  const metadataRaw = (request.body as { metadata: string }).metadata;
  const metadata = JSON.parse(metadataRaw);
  const validation = await metadataSchema.safeParseAsync(metadata);
  if (!validation.success) {
    return response.status(400).json({
      code: "ValidationError",
      message: "Invalid metadata format",
      errors: validation.error?.issues,
    });
  }
  // Assign parsed metadata array to request.body for downstream use
  request.body.metadata = metadata;

  if (metadata.length !== (request.files as Express.Multer.File[]).length) {
    return response.status(400).json({
      code: "ValidationError",
      message:
        "The number of metadata entries does not match the number of uploaded files",
    });
  }

  if (Array.isArray(request.files)) {
    for (const file of request.files) {
      if (file.size > MAX_FILE_SIZE) {
        return response.status(413).json({
          code: "validationError",
          message: `File ${file.originalname} exceeds the maximum allowed size of 25MB`,
        });
      }
      const ext = path.extname(file.originalname).toLowerCase();
      if (
        ext !== ".pdf" &&
        ext !== ".jpeg" &&
        ext !== ".jpg" &&
        ext !== ".png"
      ) {
        return response.status(415).json({
          code: "ValidationError",
          message: `File ${file.originalname} has an unsupported format. Only PDF and image files are allowed.`,
        });
      }
      try {
        const data = await uploadToCloudinary(file.buffer);
        if (!data) {
          return response.status(500).json({
            code: "InternalServerError",
            message: `Failed to upload file ${file.originalname}, please try again later.`,
          });
        }
        request.resources = request.resources
          ? [...request.resources, data]
          : [data];
      } catch (error) {
        return response.status(500).json({
          code: "InternalServerError",
          message: `An error occurred while uploading file ${file.originalname}, please try again later.`,
          err: error,
        });
      }
    }
  }
  return next();
};

export default uploadResources;
