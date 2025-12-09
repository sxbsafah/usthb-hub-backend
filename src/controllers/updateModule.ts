import { Request, Response } from "express";
import Module from "@/models/module";
import Faculty from "@/models/faculty";

const updateModule = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { name, facultyId } = request.body as {
      name?: string;
      facultyId?: string;
    };

    const module = await Module.findById(id);
    if (!module) {
      return response.status(404).json({
        code: "NotFound",
        message: "Module not found",
      });
    }

    if (name) {
      const duplicate = await Module.findOne({ name, _id: { $ne: id } });
      if (duplicate) {
        return response.status(400).json({
          code: "DuplicateModuleName",
          message: "Module name is already in use",
        });
      }
      module.name = name;
    }

    if (facultyId) {
      const facultyExists = await Faculty.findById(facultyId);
      if (!facultyExists) {
        return response.status(400).json({
          code: "InvalidFacultyId",
          message: "Faculty with the given ID does not exist",
        });
      }
      module.facultyId = facultyId as any;
    }

    await module.save();

    return response.status(200).json({
      message: "Module updated successfully",
      module: {
        moduleId: module._id,
        name: module.name,
        facultyId: module.facultyId,
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

export default updateModule;
