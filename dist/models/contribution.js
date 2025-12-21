"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contributionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
    },
    description: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "Description is required"],
        maxLength: [500, "Description must be at most 500 characters long"],
        minLength: [10, "Description must be at least 10 characters long"],
    }
});
exports.default = mongoose_1.default.model("Contribution", contributionSchema);
