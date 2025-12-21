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
const resource_1 = __importDefault(require("../models/resource"));
const user_1 = __importDefault(require("../models/user"));
const getResourcesByUserId = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = request.params;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return response.status(404).json({
                code: "NotFound",
                message: "User not found",
            });
        }
        const resources = yield resource_1.default.find()
            .populate({
            path: "contributionId",
            match: { userId: userId },
            select: "description userId",
        })
            .populate("subModuleOrModuleId", "name")
            .sort({ createdAt: -1 });
        const userResources = resources.filter((resource) => resource.contributionId !== null);
        return response.status(200).json({
            message: "Resources retrieved successfully",
            user: {
                id: user._id,
                email: user.email,
            },
            resources: userResources,
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
exports.default = getResourcesByUserId;
