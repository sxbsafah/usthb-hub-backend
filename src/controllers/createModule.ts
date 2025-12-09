import { Request, Response } from "express";
import Module, { IModule } from "@/models/module";


type ModuleData = Pick<IModule, "name" | "facultyId">;


const createModule = async (request: Request, response: Response) => {
  try {
    const { name, facultyId } = request.body as ModuleData;
    const module = await Module.create({ name, facultyId });
    return response.status(201).json({
      message: "Module created successfully",
      module: {
        name: name,
        moduleId: module._id,
        facultyId: facultyId,
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

export default createModule;  