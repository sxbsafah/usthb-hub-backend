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
const getPendingContributions = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingResources = yield resource_1.default.find({ status: "pending" })
            .populate("contributionId")
            .populate("subModuleOrModuleId", "name");
        const contributionsMap = new Map();
        for (const resource of pendingResources) {
            const contribution = resource.contributionId;
            const contributionId = contribution._id.toString();
            if (!contributionsMap.has(contributionId)) {
                const fullContribution = yield contribution_1.default.findById(contributionId).populate("userId", "email");
                contributionsMap.set(contributionId, {
                    contribution: fullContribution,
                    resources: [],
                });
            }
            contributionsMap.get(contributionId).resources.push(resource);
        }
        const pendingContributions = Array.from(contributionsMap.values());
        return response.status(200).json({
            message: "Pending contributions retrieved successfully",
            count: pendingContributions.length,
            contributions: pendingContributions,
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
exports.default = getPendingContributions;
