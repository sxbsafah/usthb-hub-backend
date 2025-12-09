import { Request, Response } from "express";
import SubModule from "@/models/subModule";

const deleteSubModule = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const subModule = await SubModule.findById(id);
    if (!subModule) {
      return response.status(404).json({
        code: "NotFound",
        message: "SubModule not found",
      });
    }

    await subModule.deleteOne();

    return response.status(200).json({
      message: "SubModule deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default deleteSubModule;
