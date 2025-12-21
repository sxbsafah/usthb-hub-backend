import { Router } from "express";
import register from "@/controllers/auth/register";
import validateRequest from "@/middlewares/validateRequest";
import {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  passwordValidator,
  loginEmailValidator,
  loginPasswordValidator,
} from "@/validators/validators";
import login from "@/controllers/auth/login";
import authenticate from "@/middlewares/authenticate";
import logout from "@/controllers/auth/logout";

const router = Router();

router.get("/", (req, res) => {
  return res.json({
    message: "Auth route is live",
    status: "ok",
  });
});

router.post(
  "/register",
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  passwordValidator,
  validateRequest,
  register
);

router.post(
  "/login",
  loginEmailValidator,
  loginPasswordValidator,
  validateRequest,
  login
);

router.get("/logout", authenticate("user"), logout);

export default router;
