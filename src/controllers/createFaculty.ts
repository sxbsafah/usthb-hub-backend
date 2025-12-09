import { Request, Response } from "express";
import Faculty, { IFaculty } from "@/models/faculty";

type FacultyData = Pick<IFaculty, "name">;


const createFaculty = async (request: Request, response: Response) => {
  try {
    const { name } = request.body as FacultyData;
    const faculty = await Faculty.create({ name });
    return response.status(201).json({
      message: "Faculty created successfully",
      faculty: {
        name: name,
        facultyId: faculty._id,
      }
    })
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    })
  }
}

export default createFaculty;