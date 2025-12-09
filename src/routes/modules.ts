import { Router } from "express";
import createModule from "@/controllers/createModule";
import getModules from "@/controllers/getModules";
import getModuleById from "@/controllers/getModuleById";
import getModulesByFacultyId from "@/controllers/getModulesByFacultyId";
import updateModule from "@/controllers/updateModule";
import deleteModule from "@/controllers/deleteModule";
import validateRequest from "@/middlewares/validateRequest";
import authenticate from "@/middlewares/authenticate";
import {
  facultyIdValidator,
  moduleNameValidator,
  facultyIdParamRouteValidator,
  moduleIdRouteValidator,
} from "@/validators/validators";

const router = Router();

router.get("/", getModules);

router.get(
  "/faculty/:facultyId",
  facultyIdParamRouteValidator,
  validateRequest,
  getModulesByFacultyId
);

router.get("/:id", moduleIdRouteValidator, validateRequest, getModuleById);

router.post(
  "/",
  authenticate("admin"),
  moduleNameValidator,
  facultyIdValidator,
  validateRequest,
  createModule
);

router.put(
  "/:id",
  authenticate("admin"),
  moduleIdRouteValidator,
  validateRequest,
  updateModule
);

router.delete(
  "/:id",
  authenticate("admin"),
  moduleIdRouteValidator,
  validateRequest,
  deleteModule
);

export default router;
