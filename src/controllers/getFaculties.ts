import { Request, Response } from "express";
import Faculty from "@/models/faculty";

const getFaculties = async (request: Request, response: Response) => {
  try {
    const faculties = await Faculty.find();

    return response.status(200).json({
      message: "Faculties retrieved successfully",
      faculties: faculties,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getFaculties;
