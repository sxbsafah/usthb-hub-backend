import { Router } from "express";
import createContribution from "@/controllers/createContribution";
import getContributions from "@/controllers/getContributions";
import getContributionById from "@/controllers/getContributionById";
import deleteContribution from "@/controllers/deleteContribution";
import updateResource from "@/controllers/updateResource";
import updateContribution from "@/controllers/updateContribution";
import updateResourceStatus from "@/controllers/updateResourceStatus";
import getPendingContributions from "@/controllers/getPendingContributions";
import getAllResources from "@/controllers/getAllResources";
import getResourcesByContributionId from "@/controllers/getResourcesByContributionId";
import getResourcesByUserId from "@/controllers/getResourcesByUserId";
import getMyResources from "@/controllers/getMyResources";
import getMyContributions from "@/controllers/getMyContributions";
import validateRequest from "@/middlewares/validateRequest";
import authenticate from "@/middlewares/authenticate";
import multer from "multer";
import {
  contributionDescriptionValidator,
  contributionIdRouteValidator,
  resourceIdRouteValidator,
  resourceStatusValidator,
} from "@/validators/validators";
import uploadResources from "@/middlewares/uploadResources";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getContributions);

router.get("/my/all", authenticate("user"), getMyContributions);

router.get("/resources/all", getAllResources);

router.get("/resources/user/:userId", getResourcesByUserId);

router.get("/resources/my", authenticate("user"), getMyResources);

router.get("/pending", authenticate("admin"), getPendingContributions);

router.get(
  "/:id/resources",
  contributionIdRouteValidator,
  validateRequest,
  getResourcesByContributionId
);

router.get(
  "/:id",
  contributionIdRouteValidator,
  validateRequest,
  getContributionById
);

router.post(
  "/",
  authenticate("user"),
  upload.array("files", 10),
  contributionDescriptionValidator,
  validateRequest,
  uploadResources,
  createContribution
);

router.put(
  "/:id",
  authenticate("user"),
  contributionIdRouteValidator,
  validateRequest,
  upload.array("files", 10),
  uploadResources,
  updateContribution
);







router.put(
  "/resource/:resourceId",
  authenticate("user"),
  resourceIdRouteValidator,
  validateRequest,
  upload.single("file"),
  uploadResources,
  updateResource
);

router.patch(
  "/resource/:resourceId/",
  authenticate("admin"),
  resourceIdRouteValidator,
  resourceStatusValidator,
  validateRequest,
  updateResourceStatus
);



router.delete(
  "/:id",
  authenticate("user"),
  contributionIdRouteValidator,
  validateRequest,
  deleteContribution
);

export default router;
