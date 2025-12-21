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
const contribution_1 = __importDefault(require("../models/contribution"));
const resource_1 = __importDefault(require("../models/resource"));
const getMyContributions = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.userId;
        const contributions = yield contribution_1.default.find({ userId: userId })
            .populate("userId")
            .sort({ createdAt: -1 });
        const contributionsWithResources = yield Promise.all(contributions.map((contribution) => __awaiter(void 0, void 0, void 0, function* () {
            const resources = yield resource_1.default.find({
                contributionId: contribution._id,
            }).populate("subModuleOrModuleId", "name");
            return Object.assign(Object.assign({}, (yield contribution.populate("userId")).toObject()), { resources: resources });
        })));
        return response.status(200).json({
            message: "Your contributions retrieved successfully",
            contributions: contributionsWithResources,
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
exports.default = getMyContributions;
