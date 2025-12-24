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
        }).lean(); // Use lean() for better performance

        console.log("=== Processing", resources.length, "resources ===");

        // Manually populate and get faculty name for each resource
        const resourcesWithFacultyName = await Promise.all(
          resources.map(async (resource) => {
            let facultyName = null;
            let populatedSubModuleOrModule = null;

            if (!resource.subModuleOrModuleId) {
              return {
                ...resource,
                subModuleOrModuleId: null,
                facultyName: null,
              };
            }

            try {
              if (resource.subModuleOrModuleType === "Module") {
                console.log(
                  "🔍 Fetching Module:",
                  resource.subModuleOrModuleId
                );

                const module = await Module.findById(
                  resource.subModuleOrModuleId
                )
                  .lean()
                  .exec();

                console.log(
                  "✅ Module result:",
                  module ? "FOUND" : "NOT FOUND"
                );

                if (module) {
                  populatedSubModuleOrModule = module;

                  if (module.facultyId) {
                    facultyName = await getFacultyNameById(module.facultyId);
                    console.log("✅ Faculty name:", facultyName);
                  }
                }
              } else if (resource.subModuleOrModuleType === "SubModule") {
                console.log(
                  "🔍 Fetching SubModule:",
                  resource.subModuleOrModuleId
                );

                const subModule = await SubModule.findById(
                  resource.subModuleOrModuleId
                )
                  .lean()
                  .exec();

                console.log(
                  "✅ SubModule result:",
                  subModule ? "FOUND" : "NOT FOUND"
                );

                if (subModule) {
                  populatedSubModuleOrModule = subModule;

                  if (subModule.moduleId) {
                    console.log(
                      "🔍 Fetching parent Module:",
                      subModule.moduleId
                    );
                    const module = await Module.findById(subModule.moduleId)
                      .lean()
                      .exec();

                    console.log(
                      "✅ Parent Module result:",
                      module ? "FOUND" : "NOT FOUND"
                    );

                    if (module && module.facultyId) {
                      facultyName = await getFacultyNameById(module.facultyId);
                      console.log("✅ Faculty name:", facultyName);
                    }
                  }
                }
              }
            } catch (err) {
              console.error(
                "❌ Error fetching data for resource:",
                resource._id,
                err
              );
            }

            return {
              ...resource,
              subModuleOrModuleId: populatedSubModuleOrModule,
              facultyName,
            };
          })
        );

        const cObj = contribution.toObject
          ? contribution.toObject()
          : contribution;
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
    console.error("❌ ERROR in getContributions:", error);
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getContributions;
