import { Request, Response } from "express";
import SubModule from "@/models/subModule";

const getSubModulesByModuleId = async (
  request: Request,
  response: Response
) => {
  try {
    const { moduleId } = request.params;

    const subModules = await SubModule.find({ moduleId }).populate(
      "moduleId",
      "name"
    );

    if (subModules.length === 0) {
      return response.status(404).json({
        code: "NotFound",
        message: "No submodules found for this module",
      });
    }

    return response.status(200).json({
      message: "SubModules retrieved successfully",
      subModules: subModules,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getSubModulesByModuleId;
