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

        console.log("=== RESOURCES FOR CONTRIBUTION ===");
        console.log("Contribution ID:", contribution._id);
        console.log("Number of resources:", resources.length);

        // Manually populate and get faculty name for each resource
        const resourcesWithFacultyName = await Promise.all(
          resources.map(async (resource) => {
            console.log("\n--- Processing Resource ---");
            console.log("Resource ID:", resource._id);
            console.log("subModuleOrModuleId:", resource.subModuleOrModuleId);
            console.log("subModuleOrModuleType:", resource.subModuleOrModuleType);
            console.log("Type of subModuleOrModuleId:", typeof resource.subModuleOrModuleId);
            
            let facultyName = null;
            let populatedSubModuleOrModule = null;

            if (!resource.subModuleOrModuleId) {
              console.log("❌ subModuleOrModuleId is null/undefined");
              const resourceObj = resource.toObject();
              return {
                ...resourceObj,
                subModuleOrModuleId: null,
                facultyName: null,
              };
            }

            if (resource.subModuleOrModuleType === "Module") {
              console.log("🔍 Fetching Module with ID:", resource.subModuleOrModuleId);
              
              const module = await Module.findById(resource.subModuleOrModuleId);
              
              console.log("Module found:", module ? "YES" : "NO");
              if (module) {
                console.log("Module data:", JSON.stringify(module, null, 2));
                populatedSubModuleOrModule = module.toObject();
                
                if (module.facultyId) {
                  console.log("Faculty ID:", module.facultyId);
                  facultyName = await getFacultyNameById(module.facultyId);
                  console.log("Faculty name:", facultyName);
                } else {
                  console.log("❌ No facultyId in module");
                }
              }
            } else if (resource.subModuleOrModuleType === "SubModule") {
              console.log("🔍 Fetching SubModule with ID:", resource.subModuleOrModuleId);
              
              const subModule = await SubModule.findById(resource.subModuleOrModuleId);
              
              console.log("SubModule found:", subModule ? "YES" : "NO");
              if (subModule) {
                console.log("SubModule data:", JSON.stringify(subModule, null, 2));
                populatedSubModuleOrModule = subModule.toObject();
                
                if (subModule.moduleId) {
                  console.log("Parent module ID:", subModule.moduleId);
                  const module = await Module.findById(subModule.moduleId);
                  
                  console.log("Parent module found:", module ? "YES" : "NO");
                  if (module) {
                    console.log("Parent module data:", JSON.stringify(module, null, 2));
                    if (module.facultyId) {
                      console.log("Faculty ID:", module.facultyId);
                      facultyName = await getFacultyNameById(module.facultyId);
                      console.log("Faculty name:", facultyName);
                    } else {
                      console.log("❌ No facultyId in parent module");
                    }
                  }
                } else {
                  console.log("❌ No moduleId in subModule");
                }
              }
            } else {
              console.log("❌ Invalid subModuleOrModuleType:", resource.subModuleOrModuleType);
            }

            // Return resource with populated data
            const resourceObj = resource.toObject();
            console.log("Final populated data:", populatedSubModuleOrModule ? "EXISTS" : "NULL");
            console.log("Final faculty name:", facultyName);
            
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
    console.error("❌ ERROR in getContributions:", error);
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getContributions;