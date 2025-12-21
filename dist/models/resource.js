"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resourceSchema = new mongoose_1.default.Schema({
    contributionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Contribution ID is required"],
        ref: "Contribution",
    },
    file_url: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "File URL is required"],
        unique: true,
    },
    publicId: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "Public ID is required"],
        unique: true,
    },
    status: {
        type: mongoose_1.default.Schema.Types.String,
        enum: {
            values: ["approved", "pending", "rejected"],
            message: "Status must be either 'approved', 'pending', or 'rejected'",
        },
        default: "pending",
        required: [true, "Status is required"],
    },
    subModuleOrModuleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "SubModule ID is required"],
        ref: "subModuleOrModuleType",
    },
    subModuleOrModuleType: {
        type: String,
        required: true,
        enum: ["SubModule", "Module"], // allowed references
    },
    resourceType: {
        type: mongoose_1.default.Schema.Types.String,
        enum: {
            values: ["td", "tp", "exam", "course_material"],
            message: "Resource type must be either 'td', 'tp', 'exam', or 'course_material'",
        },
        required: [true, "Resource type is required"],
    },
});
exports.default = mongoose_1.default.model("Resource", resourceSchema);
