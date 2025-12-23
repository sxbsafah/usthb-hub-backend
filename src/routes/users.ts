import { Router } from "express";

import {
  getUsers,
  getUserById,
  deleteUser,
  getCurretUser,
  updateUserInfo,
} from "../controllers/users";
import authenticate from "../middlewares/authenticate";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.get("/getCurrentUser", getCurretUser);

// Update current logged-in user's firstname and lastname
router.put("/me", authenticate("user"), updateUserInfo);

export default router;
