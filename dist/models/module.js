"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moduleSchema = new mongoose_1.default.Schema({
    name: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "Module name is required"],
        unique: true,
        maxLength: [100, "Module name must be at most 100 characters long"],
        minLength: [2, "Module name must be at least 2 characters long"],
    },
    facultyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Faculty ID is required"],
        ref: "Faculty",
    }
});
exports.default = mongoose_1.default.model("Module", moduleSchema);
