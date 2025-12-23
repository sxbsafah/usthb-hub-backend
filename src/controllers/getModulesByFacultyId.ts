import { Request, Response } from "express";
import Module from "@/models/module";
import SubModule from "@/models/subModule";

const getModulesByFacultyId = async (request: Request, response: Response) => {
  try {
    const { facultyId } = request.params;

    const modules = await Module.find({ facultyId }).lean().populate(
      "facultyId",
      "name"
    );

    if (modules.length === 0) {
      return response.status(404).json({
        code: "NotFound",
        message: "No modules found for this faculty",
      });
    }
    return response.status(200).json({
      message: "Modules retrieved successfully",
      modules: await Promise.all(
        modules.map(async (module) => ({
          ...module,
          doesHeHaveSubModules: !!(await SubModule.exists({
            moduleId: module._id,
          })),
        }))
      ),
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getModulesByFacultyId;
