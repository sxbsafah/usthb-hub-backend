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
const updateContribution = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = request.params;
        const contribution = yield contribution_1.default.findById(id);
        if (!contribution) {
            return response.status(404).json({
                code: "NotFound",
                message: "Contribution not found",
            });
        }
        if (contribution.userId.toString() !== ((_a = request.userId) === null || _a === void 0 ? void 0 : _a.toString())) {
            return response.status(403).json({
                code: "Forbidden",
                message: "You can only update your own contributions",
            });
        }
        const { description } = request.body;
        if (description) {
            contribution.description = description;
            yield contribution.save();
        }
        const uploaded = request.resources || [];
        if (uploaded.length > 0) {
            const metadataRaw = request.body.metadata;
            if (!metadataRaw) {
                return response.status(400).json({
                    code: "ValidationError",
                    message: "Metadata is required when uploading files",
                });
            }
            const metadata = JSON.parse(metadataRaw);
            if (metadata.length !== uploaded.length) {
                return response.status(400).json({
                    code: "ValidationError",
                    message: "Metadata count does not match uploaded files count",
                });
            }
            for (let i = 0; i < uploaded.length; i++) {
                const data = uploaded[i];
                const meta = metadata[i];
                yield resource_1.default.create({
                    contributionId: contribution._id,
                    subModuleOrModuleId: meta.subModuleOrModuleId,
                    subModuleOrModuleType: meta.subModuleOrModuleType,
                    resourceType: meta.resourceType,
                    publicId: data.public_id,
                    file_url: data.secure_url,
                    status: "pending",
                });
            }
        }
        return response.status(200).json({
            message: "Contribution updated successfully",
            contribution,
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
exports.default = updateContribution;
