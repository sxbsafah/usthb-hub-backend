"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceStatusValidator = exports.resourceIdRouteValidator = exports.contributionIdRouteValidator = exports.contributionDescriptionValidator = exports.subModuleOrModuleTypeValidator = exports.subModuleOrModuleIdValidator = exports.moduleIdRouteValidator = exports.facultyIdRouteValidator = exports.moduleIdParamRouteValidator = exports.facultyIdParamRouteValidator = exports.moduleIdParamValidator = exports.facultyIdParamValidator = exports.subModuleNameValidator = exports.moduleIdValidator = exports.facultyNameValidator = exports.facultyIdValidator = exports.moduleNameValidator = exports.loginPasswordValidator = exports.loginEmailValidator = exports.lastNameValidator = exports.firstNameValidator = exports.passwordValidator = exports.emailValidator = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const module_1 = __importDefault(require("../models/module"));
const faculty_1 = __importDefault(require("../models/faculty"));
const subModule_1 = __importDefault(require("../models/subModule"));
const contribution_1 = __importDefault(require("../models/contribution"));
const resource_1 = __importDefault(require("../models/resource"));
exports.emailValidator = (0, express_validator_1.body)("email")
    .isString()
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.default.findOne({ email: value });
    if (existingUser) {
        throw new Error("Email is already in use");
    }
}));
exports.passwordValidator = (0, express_validator_1.body)("password")
    .isString()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
exports.firstNameValidator = (0, express_validator_1.body)("firstName")
    .isString()
    .notEmpty()
    .withMessage("firstName is Required")
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters");
exports.lastNameValidator = (0, express_validator_1.body)("lastName")
    .isString()
    .notEmpty()
    .withMessage("lastName is Required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be between 2 and 30 characters");
exports.loginEmailValidator = (0, express_validator_1.body)("email")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid email address");
exports.loginPasswordValidator = (0, express_validator_1.body)("password")
    .isString()
    .notEmpty()
    .withMessage("Password is Required");
exports.moduleNameValidator = (0, express_validator_1.body)("name")
    .isString()
    .notEmpty()
    .withMessage("Module name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Module name must be between 2 and 100 characters long")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingModule = yield module_1.default.findOne({ name: value });
    if (existingModule) {
        throw new Error("Module name is already in use");
    }
}));
exports.facultyIdValidator = (0, express_validator_1.body)("facultyId")
    .isString()
    .notEmpty()
    .withMessage("Faculty ID is required")
    .isMongoId()
    .withMessage("Invalid Faculty ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFaculty = yield faculty_1.default.findById(value);
    if (!existingFaculty) {
        throw new Error("Faculty with the given ID does not exist");
    }
}));
exports.facultyNameValidator = (0, express_validator_1.body)("name")
    .isString()
    .notEmpty()
    .withMessage("Faculty name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Faculty name must be between 2 and 100 characters long")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFaculty = yield faculty_1.default.findOne({ name: value });
    if (existingFaculty) {
        throw new Error("Faculty name is already in use");
    }
}));
exports.moduleIdValidator = (0, express_validator_1.body)("moduleId")
    .isString()
    .notEmpty()
    .withMessage("Module ID is required")
    .isMongoId()
    .withMessage("Invalid Module ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingModule = yield module_1.default.findById(value);
    if (!existingModule) {
        throw new Error("Module with the given ID does not exist");
    }
}));
exports.subModuleNameValidator = (0, express_validator_1.body)("name")
    .isString()
    .notEmpty()
    .withMessage("SubModule name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("SubModule name must be between 2 and 100 characters long")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSubModule = yield subModule_1.default.findOne({ name: value });
    if (existingSubModule) {
        throw new Error("SubModule name is already in use");
    }
}));
exports.facultyIdParamValidator = (0, express_validator_1.body)("facultyId")
    .isString()
    .notEmpty()
    .withMessage("Faculty ID is required")
    .isMongoId()
    .withMessage("Invalid Faculty ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFaculty = yield faculty_1.default.findById(value);
    if (!existingFaculty) {
        throw new Error("Faculty with the given ID does not exist");
    }
}));
exports.moduleIdParamValidator = (0, express_validator_1.body)("moduleId")
    .isString()
    .notEmpty()
    .withMessage("Module ID is required")
    .isMongoId()
    .withMessage("Invalid Module ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingModule = yield module_1.default.findById(value);
    if (!existingModule) {
        throw new Error("Module with the given ID does not exist");
    }
}));
exports.facultyIdParamRouteValidator = (0, express_validator_1.param)("facultyId")
    .isMongoId()
    .withMessage("Invalid Faculty ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFaculty = yield faculty_1.default.findById(value);
    if (!existingFaculty) {
        throw new Error("Faculty with the given ID does not exist");
    }
}));
exports.moduleIdParamRouteValidator = (0, express_validator_1.param)("moduleId")
    .isMongoId()
    .withMessage("Invalid Module ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingModule = yield module_1.default.findById(value);
    if (!existingModule) {
        throw new Error("Module with the given ID does not exist");
    }
}));
exports.facultyIdRouteValidator = (0, express_validator_1.param)("id")
    .isMongoId()
    .withMessage("Invalid Faculty ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFaculty = yield faculty_1.default.findById(value);
    if (!existingFaculty) {
        throw new Error("Faculty with the given ID does not exist");
    }
}));
exports.moduleIdRouteValidator = (0, express_validator_1.param)("id")
    .isMongoId()
    .withMessage("Invalid Module ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingModule = yield module_1.default.findById(value);
    if (!existingModule) {
        throw new Error("Module with the given ID does not exist");
    }
}));
exports.subModuleOrModuleIdValidator = (0, express_validator_1.param)("id")
    .isMongoId()
    .withMessage("Invalid ID");
exports.subModuleOrModuleTypeValidator = (0, express_validator_1.body)("subModuleOrModuleType")
    .isIn(["SubModule", "Module"])
    .withMessage("Invalid type, must be 'SubModule' or 'Module'");
exports.contributionDescriptionValidator = (0, express_validator_1.body)("description")
    .isString()
    .notEmpty()
    .withMessage("Contribution description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Contribution description must be between 10 and 500 characters long");
exports.contributionIdRouteValidator = (0, express_validator_1.param)("id")
    .isMongoId()
    .withMessage("Invalid Contribution ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingContribution = yield contribution_1.default.findById(value);
    if (!existingContribution) {
        throw new Error("Contribution with the given ID does not exist");
    }
}));
exports.resourceIdRouteValidator = (0, express_validator_1.param)("resourceId")
    .isMongoId()
    .withMessage("Invalid Resource ID")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existingResource = yield resource_1.default.findById(value);
    if (!existingResource) {
        throw new Error("Resource with the given ID does not exist");
    }
}));
exports.resourceStatusValidator = (0, express_validator_1.body)("status")
    .isString()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be either 'approved' or 'rejected'");
