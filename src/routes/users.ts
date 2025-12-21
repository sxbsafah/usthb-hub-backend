import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users";

const router = Router();

// Create user
// Get all users
router.get("/", getUsers);
// Get user by ID
router.get("/:id", getUserById);
// Delete user
router.delete("/:id", deleteUser);

export default router;
