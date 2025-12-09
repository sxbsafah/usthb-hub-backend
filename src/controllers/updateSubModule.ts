import { Request, Response } from "express";
import SubModule from "@/models/subModule";
import Module from "@/models/module";

const updateSubModule = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { name, moduleId } = request.body as {
      name?: string;
      moduleId?: string;
    };

    const subModule = await SubModule.findById(id);
    if (!subModule) {
      return response.status(404).json({
        code: "NotFound",
        message: "SubModule not found",
      });
    }

    if (name) {
      const duplicate = await SubModule.findOne({ name, _id: { $ne: id } });
      if (duplicate) {
        return response.status(400).json({
          code: "DuplicateSubModuleName",
          message: "SubModule name is already in use",
        });
      }
      subModule.name = name;
    }

    if (moduleId) {
      const moduleExists = await Module.findById(moduleId);
      if (!moduleExists) {
        return response.status(400).json({
          code: "InvalidModuleId",
          message: "Module with the given ID does not exist",
        });
      }
      subModule.moduleId = moduleId as any;
    }

    await subModule.save();

    return response.status(200).json({
      message: "SubModule updated successfully",
      subModule: {
        subModuleId: subModule._id,
        name: subModule.name,
        moduleId: subModule.moduleId,
      },
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default updateSubModule;
