import type { Request, Response } from "express";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";
import Module from "@/models/module";
import SubModule from "@/models/subModule";
import { getFacultyNameById } from "@/lib/facultyName";

const getContributions = async (req: Request, response: Response) => {
  try {
    const contributions = await Contribution.find().populate("userId");

    // For each contribution, fetch its resources manually
    const contributionsWithResources = await Promise.all(
      contributions.map(async (contribution) => {
        const resources = await Resource.find({
          contributionId: contribution._id,
        });

        // Manually populate and get faculty name for each resource
        const resourcesWithFacultyName = await Promise.all(
          resources.map(async (resource) => {
            let facultyName = null;
            let populatedSubModuleOrModule = null;

            if (resource.subModuleOrModuleId) {
              if (resource.subModuleOrModuleType === "Module") {
                // Fetch the module
                const module = await Module.findById(
                  resource.subModuleOrModuleId
                );

                if (module) {
                  populatedSubModuleOrModule = module.toObject();

                  if (module.facultyId) {
                    facultyName = await getFacultyNameById(module.facultyId);
                  }
                }
              } else if (resource.subModuleOrModuleType === "SubModule") {
                // Fetch the submodule
                const subModule = await SubModule.findById(
                  resource.subModuleOrModuleId
                );

                if (subModule) {
                  populatedSubModuleOrModule = subModule.toObject();

                  // Fetch the parent module to get facultyId
                  if (subModule.moduleId) {
                    const module = await Module.findById(subModule.moduleId);

                    if (module && module.facultyId) {
                      facultyName = await getFacultyNameById(module.facultyId);
                    }
                  }
                }
              }
            }

            // Return resource with populated data
            const resourceObj = resource.toObject();
            return {
              ...resourceObj,
              subModuleOrModuleId: populatedSubModuleOrModule,
              facultyName,
            };
          })
        );

        const cObj = contribution.toObject();
        return {
          _id: cObj._id,
          userId: cObj.userId,
          description: cObj.description,
          createdAt: cObj.createdAt,
          updatedAt: cObj.updatedAt,
          resources: resourcesWithFacultyName,
        };
      })
    );

    return response.status(200).json({
      message: "Contributions retrieved successfully",
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

export default getContributions;
