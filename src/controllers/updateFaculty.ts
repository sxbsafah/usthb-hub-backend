import { Request, Response } from "express";
import Faculty from "@/models/faculty";

const updateFaculty = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { name } = request.body as { name?: string };

    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return response.status(404).json({
        code: "NotFound",
        message: "Faculty not found",
      });
    }

    if (name) {
      const duplicate = await Faculty.findOne({ name, _id: { $ne: id } });
      if (duplicate) {
        return response.status(400).json({
          code: "DuplicateFacultyName",
          message: "Faculty name is already in use",
        });
      }
      faculty.name = name;
    }

    await faculty.save();

    return response.status(200).json({
      message: "Faculty updated successfully",
      faculty: {
        facultyId: faculty._id,
        name: faculty.name,
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

export default updateFaculty;
