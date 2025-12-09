import { Request, Response } from "express";
import Module from "@/models/module";

const getModules = async (request: Request, response: Response) => {
  try {
    const modules = await Module.find().populate("facultyId", "name");

    return response.status(200).json({
      message: "Modules retrieved successfully",
      modules: modules,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default getModules;
