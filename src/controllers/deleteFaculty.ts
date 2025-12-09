import { Request, Response } from "express";
import Faculty from "@/models/faculty";
import Module from "@/models/module";
import SubModule from "@/models/subModule";

const deleteFaculty = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return response.status(404).json({
        code: "NotFound",
        message: "Faculty not found",
      });
    }

    const modules = await Module.find({ facultyId: id }).select("_id");
    const moduleIds = modules.map((m) => m._id);

    const subModuleResult = await SubModule.deleteMany({
      moduleId: { $in: moduleIds },
    });
    const moduleResult = await Module.deleteMany({ _id: { $in: moduleIds } });
    await faculty.deleteOne();

    return response.status(200).json({
      message: "Faculty deleted successfully",
      deletedModules: moduleResult.deletedCount,
      deletedSubModules: subModuleResult.deletedCount,
    });
  } catch (error) {
    return response.status(500).json({
      code: "InternalServerError",
      message: "InternalServerError occured, please try again later",
      err: error,
    });
  }
};

export default deleteFaculty;
