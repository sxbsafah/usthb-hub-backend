import { Router } from "express";
import createSubModule from "@/controllers/createSubModule";
import getSubModules from "@/controllers/getSubModules";
import getSubModuleById from "@/controllers/getSubModuleById";
import getSubModulesByModuleId from "@/controllers/getSubModulesByModuleId";
import updateSubModule from "@/controllers/updateSubModule";
import deleteSubModule from "@/controllers/deleteSubModule";
import validateRequest from "@/middlewares/validateRequest";
import authenticate from "@/middlewares/authenticate";
import {
  moduleIdValidator,
  subModuleNameValidator,
  moduleIdParamRouteValidator,
  subModuleIdRouteValidator,
} from "@/validators/validators";

const router = Router();

router.get("/", getSubModules);

router.get(
  "/module/:moduleId",
  moduleIdParamRouteValidator,
  validateRequest,
  getSubModulesByModuleId
);

router.get(
  "/:id",
  subModuleIdRouteValidator,
  validateRequest,
  getSubModuleById
);

router.post(
  "/",
  authenticate("admin"),
  subModuleNameValidator,
  moduleIdValidator,
  validateRequest,
  createSubModule
);

router.put(
  "/:id",
  authenticate("admin"),
  subModuleIdRouteValidator,
  validateRequest,
  updateSubModule
);

router.delete(
  "/:id",
  authenticate("admin"),
  subModuleIdRouteValidator,
  validateRequest,
  deleteSubModule
);

export default router;
