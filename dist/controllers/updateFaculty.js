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
const updateFaculty = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const { name } = request.body;
        const faculty = yield faculty_1.default.findById(id);
        if (!faculty) {
            return response.status(404).json({
                code: "NotFound",
                message: "Faculty not found",
            });
        }
        if (name) {
            const duplicate = yield faculty_1.default.findOne({ name, _id: { $ne: id } });
            if (duplicate) {
                return response.status(400).json({
                    code: "DuplicateFacultyName",
                    message: "Faculty name is already in use",
                });
            }
            faculty.name = name;
        }
        yield faculty.save();
        return response.status(200).json({
            message: "Faculty updated successfully",
            faculty: {
                facultyId: faculty._id,
                name: faculty.name,
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
exports.default = updateFaculty;
