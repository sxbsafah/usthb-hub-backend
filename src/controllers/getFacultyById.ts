import { Request, Response } from "express";
import Faculty from "@/models/faculty";

const getFacultyById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return response.status(404).json({
        code: "NotFound",
        message: "Faculty not found",
      });
    }

    return response.status(200).json({
      message: "Faculty retrieved successfully",
      faculty: faculty,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getFacultyById;
