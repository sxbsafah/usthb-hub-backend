import { Request, Response } from "express";
import SubModule from "@/models/subModule";

const getSubModules = async (request: Request, response: Response) => {
  try {
    const subModules = await SubModule.find().populate("moduleId", "name");

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

export default getSubModules;
