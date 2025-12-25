import Resource from "../models/resource";
import { Request, Response } from "express";

// GET /resources/by-parent/:id?type=Module|SubModule
export const getResourcesByModuleOrSubModule = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    if (!id || !type || (type !== "Module" && type !== "SubModule")) {
      return res.status(400).json({ message: "Missing or invalid id/type" });
    }
    const resources = await Resource.find({
      subModuleOrModuleId: id,
      subModuleOrModuleType: type,
    });
    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
