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
const user_1 = __importDefault(require("../../models/user"));
const jwt_1 = require("../../lib/jwt");
const token_1 = __importDefault(require("../../models/token"));
const hash_1 = require("../../lib/hash");
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        if (!email) {
            return response.status(400).json({
                code: "ValidationError",
                message: "Email is required",
            });
        }
        const user = yield user_1.default.findOne({
            $or: [{ email }],
        });
        if (!user || !(yield (0, hash_1.comparePassword)(password, user.password))) {
            return response.status(400).json({
                code: "AuthenticationError",
                message: "Invalid email or password",
            });
        }
        let token = yield token_1.default.findOne({ userId: user._id });
        if (token) {
            yield token_1.default.deleteOne({ userId: user._id });
        }
        token = yield token_1.default.create({
            userId: user._id,
            token: (0, jwt_1.generateToken)(user._id),
        });
        return response.status(200).json({
            message: "Login successful",
            user: {
                token: token.token,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    }
    catch (err) {
        return response.status(500).json({
            code: "InternalServerError",
            message: "Internal server error occured, please try again later",
            error: err,
        });
    }
});
exports.default = login;
