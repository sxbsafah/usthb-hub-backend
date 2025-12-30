import { Request, Response } from "express";
import Faculty from "@/models/faculty";
import Module from "@/models/module";
import SubModule from "@/models/subModule";
import Resource from "@/models/resource";
import Contribution from "@/models/contribution";
import { getFacultyNameById } from "@/lib/facultyName";

const getFacultiesWithModulesAndResources = async (
  req: Request,
  res: Response
) => {
  try {
    const faculties = await Faculty.find();
    const result = [];
    for (const faculty of faculties) {
      const modules = await Module.find({ facultyId: faculty._id });
      const modulesWithDetails = [];
      for (const module of modules) {
        // Get submodules for this module
        const subModules = await SubModule.find({ moduleId: module._id });
        const doesHeHaveSubModules = subModules.length > 0;
        // Get only accepted resources linked to this module
        const moduleResources = await Resource.find({
          subModuleOrModuleId: module._id,
          subModuleOrModuleType: "Module",
          status: "approved",
        });
        // For each resource, get its contributions and faculty name
        const moduleFacultyName = await getFacultyNameById(module.facultyId);
        const moduleResourcesWithContributions = await Promise.all(
          moduleResources.map(async (resource) => {
            const contribution = await Contribution.findById(
              resource.contributionId
            );
            return {
              ...resource.toObject(),
              contribution,
              facultyName: moduleFacultyName,
            };
          })
        );
        // For each submodule, get only accepted resources and their contributions and faculty name
        const subModulesWithResources = await Promise.all(
          subModules.map(async (subModule) => {
            const subModuleResources = await Resource.find({
              subModuleOrModuleId: subModule._id,
              subModuleOrModuleType: "SubModule",
              status: "approved",
            });
            // Get faculty name via module
            const subModuleFacultyName = await getFacultyNameById(
              module.facultyId
            );
            const subModuleResourcesWithContributions = await Promise.all(
              subModuleResources.map(async (resource) => {
                const contribution = await Contribution.findById(
                  resource.contributionId
                );
                return {
                  ...resource.toObject(),
                  contribution,
                  facultyName: subModuleFacultyName,
                };
              })
            );
            return {
              ...subModule.toObject(),
              resources: subModuleResourcesWithContributions,
            };
          })
        );
        modulesWithDetails.push({
          ...module.toObject(),
          resources: moduleResourcesWithContributions,
          subModules: subModulesWithResources,
          doesHeHaveSubModules,
        });
      }
      result.push({
        ...faculty.toObject(),
        modules: modulesWithDetails,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      code: "InternalServerError",
      message: "An error occurred while fetching data.",
      error,
    });
  }
};

export default getFacultiesWithModulesAndResources;
