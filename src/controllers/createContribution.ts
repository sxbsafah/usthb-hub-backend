import type { Request, Response } from "express";
import Contribution, { IContribution } from "@/models/contribution";
import Resource, { IResource } from "@/models/resource";

type ContributionData = Pick<IContribution, "description"> &
  Pick<IResource, "subModuleOrModuleId" | "subModuleOrModuleType" | "resourceType">;

const createContribution = async (request: Request, response: Response) => {
  try {
    const { description } = request.body as { description: string };
    const metadata = JSON.parse(
      (request.body as { metadata: string }).metadata
    ) as ContributionData[];

    const contribution = await Contribution.create({
      description: description,
      userId: request.userId,
    });

    for (const [index, data] of metadata.entries()) {
      if (request.resources && request.resources[index]) {
        await Resource.create({
          contributionId: contribution._id,
          subModuleOrModuleId: data.subModuleOrModuleId,
          subModuleOrModuleType: data.subModuleOrModuleType,
          resourceType: data.resourceType,
          publicId: request.resources[index].public_id,
          file_url: request.resources[index].secure_url,
        });
      }
    }
    return response.status(201).json({
      code: "Success",
      message: "Contribution created successfully",
      data: await contribution.populate("userId"),
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default createContribution;
