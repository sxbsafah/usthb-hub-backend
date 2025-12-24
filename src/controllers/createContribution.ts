import type { Request, Response } from "express";
import Contribution, { IContribution } from "@/models/contribution";
import Resource, { IResource } from "@/models/resource";
import mongoose from "mongoose";
import Module from "@/models/module";
import subModule from "@/models/subModule";

type ContributionData = Pick<IContribution, "description"> &
  Pick<
    IResource,
    "subModuleOrModuleId" | "subModuleOrModuleType" | "resourceType"
  >;

const createContribution = async (request: Request, response: Response) => {
  try {
    const { description } = request.body as { description: string };
    const metadata = request.body.metadata as ContributionData[];

    console.log("📦 Received metadata:", JSON.stringify(metadata, null, 2));

    const contribution = await Contribution.create({
      description: description,
      userId: request.userId,
    });

    for (const [index, data] of metadata.entries()) {
      if (request.resources && request.resources[index]) {
        console.log("Creating resource with data:", data);
        console.log(
          "subModuleOrModuleId type:",
          typeof data.subModuleOrModuleId
        );
        console.log("subModuleOrModuleId value:", data.subModuleOrModuleId);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(data.subModuleOrModuleId)) {
          console.error("❌ Invalid ObjectId:", data.subModuleOrModuleId);
          throw new Error(
            `Invalid subModuleOrModuleId: ${data.subModuleOrModuleId}`
          );
        }
        if (
          (metadata[index].subModuleOrModuleType === "Module" &&
            (await Module.findById(data.subModuleOrModuleId)) === null) ||
          (metadata[index].subModuleOrModuleType === "SubModule" &&
            (await subModule.findById(data.subModuleOrModuleId)) === null)
        ) {
          return response.status(400).json({
            code: "BadRequest",
            message: `The provided subModuleOrModuleId does not exist in the specified type: ${data.subModuleOrModuleType}`,
          });
        }
        const resourceData = {
          contributionId: contribution._id,
          subModuleOrModuleId: data.subModuleOrModuleId, // Don't convert, let Mongoose handle it
          subModuleOrModuleType: data.subModuleOrModuleType,
          resourceType: data.resourceType,
          publicId: request.resources[index].public_id,
          file_url: request.resources[index].secure_url,
        };

        console.log("💾 Creating resource with:", resourceData);

        const createdResource = await Resource.create(resourceData);

        console.log("✅ Resource created:", createdResource);
      }
    }

    return response.status(201).json({
      code: "Success",
      message: "Contribution created successfully",
      data: await contribution.populate("userId"),
    });
  } catch (error) {
    console.error("❌ Error in createContribution:", error);
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default createContribution;
