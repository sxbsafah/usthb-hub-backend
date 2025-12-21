"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createFaculty_1 = __importDefault(require("../controllers/createFaculty"));
const getFaculties_1 = __importDefault(require("../controllers/getFaculties"));
const getFacultiesWithModulesAndResources_1 = __importDefault(require("../controllers/getFacultiesWithModulesAndResources"));
const getFacultyById_1 = __importDefault(require("../controllers/getFacultyById"));
const updateFaculty_1 = __importDefault(require("../controllers/updateFaculty"));
const deleteFaculty_1 = __importDefault(require("../controllers/deleteFaculty"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const validators_1 = require("../validators/validators");
const router = (0, express_1.Router)();
// GET /faculties/deep - Get all faculties with modules, submodules, resources, and contributions
router.get("/deep", getFacultiesWithModulesAndResources_1.default);
router.get("/", getFaculties_1.default);
router.get("/:id", validators_1.facultyIdRouteValidator, validateRequest_1.default, getFacultyById_1.default);
router.post("/", (0, authenticate_1.default)("admin"), validators_1.facultyNameValidator, validateRequest_1.default, createFaculty_1.default);
router.put("/:id", (0, authenticate_1.default)("admin"), validators_1.facultyIdRouteValidator, validateRequest_1.default, updateFaculty_1.default);
router.delete("/:id", (0, authenticate_1.default)("admin"), validators_1.facultyIdRouteValidator, validateRequest_1.default, deleteFaculty_1.default);
exports.default = router;
