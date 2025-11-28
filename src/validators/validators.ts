import {  body } from "express-validator";
import User from "@/models/user";

export const usernameValidator = body("username")
  .isString()
  .notEmpty()
  .withMessage("Username is Required")
  .isLength({ min: 3, max: 20 })
  .withMessage("Username must be between 3 and 20 characters")
  .custom(async (value: string) => {
    const existingUser = await User.findOne({ username: value });
    if (existingUser) {
      throw new Error("Username is already in use");
    }
  });

export const emailValidator = body("email")
  .isString()
  .notEmpty()
  .withMessage("Email is Required")
  .isEmail()
  .withMessage("Invalid email address")
  .custom(async (value: string) => {
    const existingUser = await User.findOne({ email: value });
    if (existingUser) {
      throw new Error("Email is already in use");
    }
  });

export const passwordValidator = body("password")
  .isString()
  .notEmpty()
  .withMessage("Password is Required")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
  .withMessage(
    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
  );

export const firstNameValidator = body("firstName")
  .isString()
  .notEmpty()
  .withMessage("firstName is Required")
  .isLength({ min: 2, max: 30 })
  .withMessage("First name must be between 2 and 30 characters");

export const lastNameValidator = body("lastName")
  .isString()
  .notEmpty()
  .withMessage("lastName is Required")
  .isLength({ min: 2, max: 30 })
  .withMessage("Last name must be between 2 and 30 characters");

export const loginEmailValidator = body("email")
  .optional()
  .isString()
  .notEmpty()
  .withMessage("Email is Required")
  .isEmail()
  .withMessage("Invalid email address")

export const loginUsernameValidator = body("username")
  .optional()
  .isString()
  .notEmpty()
  .withMessage("Username is Required");

export const loginPasswordValidator = body("password")
  .isString()
  .notEmpty()
  .withMessage("Password is Required");
