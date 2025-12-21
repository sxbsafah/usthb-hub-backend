"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const facultySchema = new mongoose_1.default.Schema({
    name: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "Faculty name is required"],
        unique: true,
        maxLength: [100, "Faculty name must be at most 100 characters long"],
        minLength: [2, "Faculty name must be at least 2 characters long"],
    },
});
exports.default = mongoose_1.default.model("Faculty", facultySchema);
