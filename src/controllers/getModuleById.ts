import { Request, Response } from "express";
import Module from "@/models/module";

const getModuleById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const module = await Module.findById(id).populate("facultyId", "name");

    if (!module) {
      return response.status(404).json({
        code: "NotFound",
        message: "Module not found",
      });
    }

    return response.status(200).json({
      message: "Module retrieved successfully",
      module: module,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getModuleById;
