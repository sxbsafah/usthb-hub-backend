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
const subModule_1 = __importDefault(require("../models/subModule"));
const module_1 = __importDefault(require("../models/module"));
const updateSubModule = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const { name, moduleId } = request.body;
        const subModule = yield subModule_1.default.findById(id);
        if (!subModule) {
            return response.status(404).json({
                code: "NotFound",
                message: "SubModule not found",
            });
        }
        if (name) {
            const duplicate = yield subModule_1.default.findOne({ name, _id: { $ne: id } });
            if (duplicate) {
                return response.status(400).json({
                    code: "DuplicateSubModuleName",
                    message: "SubModule name is already in use",
                });
            }
            subModule.name = name;
        }
        if (moduleId) {
            const moduleExists = yield module_1.default.findById(moduleId);
            if (!moduleExists) {
                return response.status(400).json({
                    code: "InvalidModuleId",
                    message: "Module with the given ID does not exist",
                });
            }
            subModule.moduleId = moduleId;
        }
        yield subModule.save();
        return response.status(200).json({
            message: "SubModule updated successfully",
            subModule: {
                subModuleOrModuleId: subModule._id,
                subModuleOrModuleType: "SubModule",
                name: subModule.name,
                moduleId: subModule.moduleId,
            },
        });
    }
    catch (error) {
        return response.status(500).json({
            code: "InternalServerError",
            message: "InternalServerError occured, please try again later",
            err: error,
        });
    }
});
exports.default = updateSubModule;
