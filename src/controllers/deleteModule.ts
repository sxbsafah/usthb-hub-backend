import { Request, Response } from "express";
import Module from "@/models/module";
import SubModule from "@/models/subModule";

const deleteModule = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const module = await Module.findById(id);
    if (!module) {
      return response.status(404).json({
        code: "NotFound",
        message: "Module not found",
      });
    }

    const subModuleResult = await SubModule.deleteMany({ moduleId: id });
    await module.deleteOne();

    return response.status(200).json({
      message: "Module deleted successfully",
      deletedSubModules: subModuleResult.deletedCount,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default deleteModule;
