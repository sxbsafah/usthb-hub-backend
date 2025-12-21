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
const jwt_1 = require("../lib/jwt");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = __importDefault(require("../models/token"));
const authenticate = (role) => {
    return (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const tokenHeader = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!tokenHeader) {
                return response.status(401).json({
                    code: "AuthenticationError",
                    message: "No token provided",
                });
            }
            const payload = (0, jwt_1.verifyToken)(tokenHeader);
            const token = yield token_1.default.findOne({ userId: payload.userId, token: tokenHeader });
            if (!token) {
                return response.status(401).json({
                    code: "AuthenticationError",
                    message: "No Token Found, User might be logged out",
                });
            }
            if (role === "admin") {
                const user = yield token_1.default.findOne({ userId: payload.userId }).populate("userId");
                if (!user || user.userId.role !== "admin") {
                    return response.status(403).json({
                        code: "AuthorizationError",
                        message: "You do not have permission to access this resource",
                    });
                }
            }
            request.userId = payload.userId;
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                return response.status(401).json({
                    code: "AuthenticationError",
                    message: "Token has expired, Please login again",
                });
            }
            return response.status(401).json({
                code: "AuthenticationError",
                message: "Invalid token",
            });
        }
    });
};
exports.default = authenticate;
