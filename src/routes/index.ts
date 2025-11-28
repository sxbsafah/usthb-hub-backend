import { Router } from "express";
import authRouter from "@/routes/auth";

const router = Router();

router.use("/auth", authRouter);

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
