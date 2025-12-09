import { Router } from "express";
import createFaculty from "@/controllers/createFaculty";
import getFaculties from "@/controllers/getFaculties";
import getFacultyById from "@/controllers/getFacultyById";
import updateFaculty from "@/controllers/updateFaculty";
import deleteFaculty from "@/controllers/deleteFaculty";
import validateRequest from "@/middlewares/validateRequest";
import authenticate from "@/middlewares/authenticate";
import {
  facultyNameValidator,
  facultyIdRouteValidator,
} from "@/validators/validators";

const router = Router();

router.get("/", getFaculties);

router.get("/:id", facultyIdRouteValidator, validateRequest, getFacultyById);

router.post(
  "/",
  authenticate("admin"),
  facultyNameValidator,
  validateRequest,
  createFaculty
);

router.put(
  "/:id",
  authenticate("admin"),
  facultyIdRouteValidator,
  validateRequest,
  updateFaculty
);

router.delete(
  "/:id",
  authenticate("admin"),
  facultyIdRouteValidator,
  validateRequest,
  deleteFaculty
);

export default router;
