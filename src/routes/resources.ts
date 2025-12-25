import { Router } from "express";
import { getResourcesByModuleOrSubModule } from "@/controllers/getResourcesByModuleOrSubModule";
import { subModuleOrModuleIdValidator } from "@/validators/validators";
import validateRequest from "@/middlewares/validateRequest";

const router = Router();

// GET /resources/by-parent/:id?type=Module|SubModule
router.get(
  "/by-parent/:id",
  subModuleOrModuleIdValidator,
  validateRequest,
  getResourcesByModuleOrSubModule
);

export default router;
