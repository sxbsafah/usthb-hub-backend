import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  getCurretUser,
} from "../controllers/users";


const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.get("/getCurrentUser", getCurretUser);


export default router;
