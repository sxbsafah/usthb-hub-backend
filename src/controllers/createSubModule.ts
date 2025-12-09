import { Request, Response } from "express";
import SubModule, { ISubModule } from "@/models/subModule";


type SubModuleData = Pick<ISubModule, "name" | "moduleId">;


const createSubModule = async (request: Request, response: Response) => {
  try {
    const { name, moduleId } = request.body as SubModuleData;
    const subModule = await SubModule.create({ name, moduleId });
    return response.status(201).json({
      message: "SubModule created successfully",
      subModule: {
        name: name,
        subModuleId: subModule._id,
        moduleId: moduleId,
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

export default createSubModule;