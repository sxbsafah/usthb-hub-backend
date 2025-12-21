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
const module_1 = __importDefault(require("../models/module"));
const faculty_1 = __importDefault(require("../models/faculty"));
const updateModule = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const { name, facultyId } = request.body;
        const module = yield module_1.default.findById(id);
        if (!module) {
            return response.status(404).json({
                code: "NotFound",
                message: "Module not found",
            });
        }
        if (name) {
            const duplicate = yield module_1.default.findOne({ name, _id: { $ne: id } });
            if (duplicate) {
                return response.status(400).json({
                    code: "DuplicateModuleName",
                    message: "Module name is already in use",
                });
            }
            module.name = name;
        }
        if (facultyId) {
            const facultyExists = yield faculty_1.default.findById(facultyId);
            if (!facultyExists) {
                return response.status(400).json({
                    code: "InvalidFacultyId",
                    message: "Faculty with the given ID does not exist",
                });
            }
            module.facultyId = facultyId;
        }
        yield module.save();
        return response.status(200).json({
            message: "Module updated successfully",
            module: {
                moduleId: module._id,
                name: module.name,
                facultyId: module.facultyId,
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
exports.default = updateModule;
