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
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const zod_1 = require("zod");
const resource_1 = __importDefault(require("../models/resource"));
const metadataSchema = zod_1.z.array(zod_1.z.object({
    resourceType: zod_1.z.enum(["td", "tp", "exam", "course_material"], "Invalid resource type"),
    subModuleOrModuleId: zod_1.z.string(),
    subModuleOrModuleType: zod_1.z.enum(["SubModule", "Module"], "Invalid type"),
}), "metadata must be an array of objects with resourceType, subModuleOrModuleId, and subModuleOrModuleType");
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const uploadResources = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { resourceId } = request.params;
    if (resourceId) {
        if (!request.file) {
            return response.status(400).json({
                code: "ValidationError",
                message: "No file provided for resource update",
            });
        }
        const resource = yield resource_1.default.findById(resourceId);
        if (!resource) {
            return response.status(404).json({
                code: "NotFound",
                message: "Resource not found",
            });
        }
        const file = request.file;
        if (file.size > MAX_FILE_SIZE) {
            return response.status(413).json({
                code: "validationError",
                message: `File exceeds the maximum allowed size of 25MB`,
            });
        }
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (ext !== ".pdf" && ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png") {
            return response.status(415).json({
                code: "ValidationError",
                message: `File has an unsupported format. Only PDF and image files are allowed.`,
            });
        }
        try {
            const data = yield (0, cloudinary_1.default)(file.buffer, resource.publicId);
            if (!data) {
                return response.status(500).json({
                    code: "InternalServerError",
                    message: `Failed to upload file, please try again later.`,
                });
            }
            request.resources = [data];
            return next();
        }
        catch (error) {
            return response.status(500).json({
                code: "InternalServerError",
                message: `An error occurred while uploading file, please try again later.`,
                err: error,
            });
        }
    }
    if (request.method === "PUT" && !request.files) {
        return next();
    }
    if (!request.files) {
        return response.status(400).json({
            code: "ValidationError",
            message: "No files were uploaded",
        });
    }
    const metadata = JSON.parse(request.body.metadata);
    if (!(yield metadataSchema.safeParseAsync(metadata)).success) {
        return response.status(400).json({
            code: "ValidationError",
            message: "Invalid metadata format",
            errors: (_a = (yield metadataSchema.safeParseAsync(metadata)).error) === null || _a === void 0 ? void 0 : _a.issues,
        });
    }
    if (metadata.length !== request.files.length) {
        return response.status(400).json({
            code: "ValidationError",
            message: "The number of metadata entries does not match the number of uploaded files",
        });
    }
    if (Array.isArray(request.files)) {
        for (const file of request.files) {
            if (file.size > MAX_FILE_SIZE) {
                return response.status(413).json({
                    code: "validationError",
                    message: `File ${file.originalname} exceeds the maximum allowed size of 25MB`,
                });
            }
            const ext = path_1.default.extname(file.originalname).toLowerCase();
            if (ext !== ".pdf" &&
                ext !== ".jpeg" &&
                ext !== ".jpg" &&
                ext !== ".png") {
                return response.status(415).json({
                    code: "ValidationError",
                    message: `File ${file.originalname} has an unsupported format. Only PDF and image files are allowed.`,
                });
            }
            try {
                const data = yield (0, cloudinary_1.default)(file.buffer);
                if (!data) {
                    return response.status(500).json({
                        code: "InternalServerError",
                        message: `Failed to upload file ${file.originalname}, please try again later.`,
                    });
                }
                request.resources = request.resources
                    ? [...request.resources, data]
                    : [data];
            }
            catch (error) {
                return response.status(500).json({
                    code: "InternalServerError",
                    message: `An error occurred while uploading file ${file.originalname}, please try again later.`,
                    err: error,
                });
            }
        }
    }
    return next();
});
exports.default = uploadResources;
