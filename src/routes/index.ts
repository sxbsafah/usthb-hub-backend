import { Router } from "express";
import authRouter from "@/routes/auth";
import facultiesRouter from "@/routes/faculties";
import modulesRouter from "@/routes/modules";
import subModulesRouter from "@/routes/subModules";
import contributionsRouter from "@/routes/contributions";

const router = Router();

router.use("/auth", authRouter);
router.use("/faculties", facultiesRouter);
router.use("/modules", modulesRouter);
router.use("/submodules", subModulesRouter);
router.use("/contributions", contributionsRouter);

router.get("/", (request, response) => {
  return response.json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    docs: "https://docs.usthb-9raya.kairos.com",
    timestamp: new Date().toISOString(),
  });
});

export default router;
