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
const faculty_1 = __importDefault(require("../models/faculty"));
const module_1 = __importDefault(require("../models/module"));
const subModule_1 = __importDefault(require("../models/subModule"));
const resource_1 = __importDefault(require("../models/resource"));
const contribution_1 = __importDefault(require("../models/contribution"));
const getFacultiesWithModulesAndResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faculties = yield faculty_1.default.find();
        const result = [];
        for (const faculty of faculties) {
            const modules = yield module_1.default.find({ facultyId: faculty._id });
            const modulesWithDetails = [];
            for (const module of modules) {
                // Get submodules for this module
                const subModules = yield subModule_1.default.find({ moduleId: module._id });
                // Get resources linked to this module
                const moduleResources = yield resource_1.default.find({
                    subModuleOrModuleId: module._id,
                    subModuleOrModuleType: "Module",
                });
                // For each resource, get its contributions
                const moduleResourcesWithContributions = yield Promise.all(moduleResources.map((resource) => __awaiter(void 0, void 0, void 0, function* () {
                    const contribution = yield contribution_1.default.findById(resource.contributionId);
                    return Object.assign(Object.assign({}, resource.toObject()), { contribution });
                })));
                // For each submodule, get its resources and their contributions
                const subModulesWithResources = yield Promise.all(subModules.map((subModule) => __awaiter(void 0, void 0, void 0, function* () {
                    const subModuleResources = yield resource_1.default.find({
                        subModuleOrModuleId: subModule._id,
                        subModuleOrModuleType: "SubModule",
                    });
                    const subModuleResourcesWithContributions = yield Promise.all(subModuleResources.map((resource) => __awaiter(void 0, void 0, void 0, function* () {
                        const contribution = yield contribution_1.default.findById(resource.contributionId);
                        return Object.assign(Object.assign({}, resource.toObject()), { contribution });
                    })));
                    return Object.assign(Object.assign({}, subModule.toObject()), { resources: subModuleResourcesWithContributions });
                })));
                modulesWithDetails.push(Object.assign(Object.assign({}, module.toObject()), { resources: moduleResourcesWithContributions, subModules: subModulesWithResources }));
            }
            result.push(Object.assign(Object.assign({}, faculty.toObject()), { modules: modulesWithDetails }));
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            code: "InternalServerError",
            message: "An error occurred while fetching data.",
            error,
        });
    }
});
exports.default = getFacultiesWithModulesAndResources;
