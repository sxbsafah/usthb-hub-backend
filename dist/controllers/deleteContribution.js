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
const cloudinary_1 = require("cloudinary");
const deleteContribution = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
                message: "You can only delete your own contributions",
            });
        }
        const resources = yield resource_1.default.find({ contributionId: id });
        for (const resource of resources) {
            try {
                yield cloudinary_1.v2.uploader.destroy(resource.publicId);
            }
            catch (error) {
                console.error(`Failed to delete file from Cloudinary: ${resource.publicId}`, error);
            }
        }
        yield resource_1.default.deleteMany({ contributionId: id });
        yield contribution.deleteOne();
        return response.status(200).json({
            message: "Contribution deleted successfully",
            deletedResources: resources.length,
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
exports.default = deleteContribution;
