"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
    },
    password: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"],
        validate: {
            validator: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/.test(value),
            message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
        },
    },
    role: {
        type: mongoose_1.default.Schema.Types.String,
        enum: {
            values: ["admin", "user"],
            message: "Role must be either 'admin' or 'user'",
        },
        default: "user",
        required: [true, "Role is required"],
    },
    firstName: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "First name is required"],
        maxLength: [30, "First name must be at most 30 characters long"],
        minLength: [2, "First name must be at least 2 characters long"],
    },
    lastName: {
        type: mongoose_1.default.Schema.Types.String,
        required: [true, "Last name is required"],
        maxLength: [30, "Last name must be at most 30 characters long"],
        minLength: [2, "Last name must be at least 2 characters long"],
    },
    otp: {
        type: {
            code: mongoose_1.default.Schema.Types.String,
            expiresAt: mongoose_1.default.Schema.Types.Date,
            isVerified: mongoose_1.default.Schema.Types.Boolean,
        },
        default: {
            isVerified: false,
            code: undefined,
            expiresAt: undefined,
        },
        required: [true, "OTP information is required"],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
