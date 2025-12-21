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
const subModule_1 = __importDefault(require("../models/subModule"));
const createSubModule = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, moduleId } = request.body;
        const subModule = yield subModule_1.default.create({ name, moduleId });
        return response.status(201).json({
            message: "SubModule created successfully",
            subModule: {
                name: name,
                subModuleOrModuleId: subModule._id,
                subModuleOrModuleType: "SubModule",
                moduleId: moduleId,
            },
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
exports.default = createSubModule;
