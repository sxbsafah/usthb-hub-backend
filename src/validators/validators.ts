import { body, param } from "express-validator";
import User from "@/models/user";
import Module from "@/models/module";
import Faculty from "@/models/faculty";
import SubModule from "@/models/subModule";
import Contribution from "@/models/contribution";
import Resource from "@/models/resource";

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
  .withMessage("Invalid email address");

export const loginPasswordValidator = body("password")
  .isString()
  .notEmpty()
  .withMessage("Password is Required");

export const moduleNameValidator = body("name")
  .isString()
  .notEmpty()
  .withMessage("Module name is required")
  .isLength({ min: 2, max: 100 })
  .withMessage("Module name must be between 2 and 100 characters long")
  .custom(async (value: string) => {
    const existingModule = await Module.findOne({ name: value });
    if (existingModule) {
      throw new Error("Module name is already in use");
    }
  });

export const facultyIdValidator = body("facultyId")
  .isString()
  .notEmpty()
  .withMessage("Faculty ID is required")
  .isMongoId()
  .withMessage("Invalid Faculty ID")
  .custom(async (value: string) => {
    const existingFaculty = await Faculty.findById(value);
    if (!existingFaculty) {
      throw new Error("Faculty with the given ID does not exist");
    }
  });

export const facultyNameValidator = body("name")
  .isString()
  .notEmpty()
  .withMessage("Faculty name is required")
  .isLength({ min: 2, max: 100 })
  .withMessage("Faculty name must be between 2 and 100 characters long")
  .custom(async (value: string) => {
    const existingFaculty = await Faculty.findOne({ name: value });
    if (existingFaculty) {
      throw new Error("Faculty name is already in use");
    }
  });

export const moduleIdValidator = body("moduleId")
  .isString()
  .notEmpty()
  .withMessage("Module ID is required")
  .isMongoId()
  .withMessage("Invalid Module ID")
  .custom(async (value: string) => {
    const existingModule = await Module.findById(value);
    if (!existingModule) {
      throw new Error("Module with the given ID does not exist");
    }
  });

export const subModuleNameValidator = body("name")
  .isString()
  .notEmpty()
  .withMessage("SubModule name is required")
  .isLength({ min: 2, max: 100 })
  .withMessage("SubModule name must be between 2 and 100 characters long")
  .custom(async (value: string) => {
    const existingSubModule = await SubModule.findOne({ name: value });
    if (existingSubModule) {
      throw new Error("SubModule name is already in use");
    }
  });

export const facultyIdParamValidator = body("facultyId")
  .isString()
  .notEmpty()
  .withMessage("Faculty ID is required")
  .isMongoId()
  .withMessage("Invalid Faculty ID")
  .custom(async (value: string) => {
    const existingFaculty = await Faculty.findById(value);
    if (!existingFaculty) {
      throw new Error("Faculty with the given ID does not exist");
    }
  });

export const moduleIdParamValidator = body("moduleId")
  .isString()
  .notEmpty()
  .withMessage("Module ID is required")
  .isMongoId()
  .withMessage("Invalid Module ID")
  .custom(async (value: string) => {
    const existingModule = await Module.findById(value);
    if (!existingModule) {
      throw new Error("Module with the given ID does not exist");
    }
  });

export const facultyIdParamRouteValidator = param("facultyId")
  .isMongoId()
  .withMessage("Invalid Faculty ID")
  .custom(async (value: string) => {
    const existingFaculty = await Faculty.findById(value);
    if (!existingFaculty) {
      throw new Error("Faculty with the given ID does not exist");
    }
  });

export const moduleIdParamRouteValidator = param("moduleId")
  .isMongoId()
  .withMessage("Invalid Module ID")
  .custom(async (value: string) => {
    const existingModule = await Module.findById(value);
    if (!existingModule) {
      throw new Error("Module with the given ID does not exist");
    }
  });

export const facultyIdRouteValidator = param("id")
  .isMongoId()
  .withMessage("Invalid Faculty ID")
  .custom(async (value: string) => {
    const existingFaculty = await Faculty.findById(value);
    if (!existingFaculty) {
      throw new Error("Faculty with the given ID does not exist");
    }
  });

export const moduleIdRouteValidator = param("id")
  .isMongoId()
  .withMessage("Invalid Module ID")
  .custom(async (value: string) => {
    const existingModule = await Module.findById(value);
    if (!existingModule) {
      throw new Error("Module with the given ID does not exist");
    }
  });

export const subModuleOrModuleIdValidator = param("id")
  .isMongoId()
  .withMessage("Invalid ID");

export const subModuleOrModuleTypeValidator = body("subModuleOrModuleType")
  .isIn(["SubModule", "Module"])
  .withMessage("Invalid type, must be 'SubModule' or 'Module'");

export const contributionDescriptionValidator = body("description")
  .isString()
  .notEmpty()
  .withMessage("Contribution description is required")
  .isLength({ min: 10, max: 500 })
  .withMessage(
    "Contribution description must be between 10 and 500 characters long"
  );

export const contributionIdRouteValidator = param("id")
  .isMongoId()
  .withMessage("Invalid Contribution ID")
  .custom(async (value: string) => {
    const existingContribution = await Contribution.findById(value);
    if (!existingContribution) {
      throw new Error("Contribution with the given ID does not exist");
    }
  });

export const resourceIdRouteValidator = param("resourceId")
  .isMongoId()
  .withMessage("Invalid Resource ID")
  .custom(async (value: string) => {
    const existingResource = await Resource.findById(value);
    if (!existingResource) {
      throw new Error("Resource with the given ID does not exist");
    }
  });

export const resourceStatusValidator = body("status")
  .isString()
  .notEmpty()
  .withMessage("Status is required")
  .isIn(["approved", "rejected"])
  .withMessage("Status must be either 'approved' or 'rejected'");
