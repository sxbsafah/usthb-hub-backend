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
const contribution_1 = __importDefault(require("../models/contribution"));
const updateResource = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { resourceId } = request.params;
        const resource = yield resource_1.default.findById(resourceId).populate("contributionId");
        if (!resource) {
            return response.status(404).json({
                code: "NotFound",
                message: "Resource not found",
            });
        }
        const contribution = yield contribution_1.default.findById(resource.contributionId);
        if (!contribution ||
            contribution.userId.toString() !== ((_a = request.userId) === null || _a === void 0 ? void 0 : _a.toString())) {
            return response.status(403).json({
                code: "Forbidden",
                message: "You can only update resources from your own contributions",
            });
        }
        if (!request.resources || request.resources.length === 0) {
            return response.status(400).json({
                code: "ValidationError",
                message: "No file provided for update",
            });
        }
        const { resourceType, subModuleOrModuleId, subModuleOrModuleType } = request.body;
        resource.file_url = request.resources[0].secure_url;
        resource.publicId = request.resources[0].public_id;
        resource.status = "pending";
        if (resourceType) {
            resource.resourceType = resourceType;
        }
        if (subModuleOrModuleId) {
            resource.subModuleOrModuleId = subModuleOrModuleId;
        }
        if (subModuleOrModuleType) {
            resource.subModuleOrModuleType = subModuleOrModuleType;
        }
        yield resource.save();
        return response.status(200).json({
            message: "Resource updated successfully",
            resource: resource,
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
exports.default = updateResource;
