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
const getContributions = (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contributions = yield contribution_1.default.find()
            .populate("userId")
            .populate("resources");
        return response.status(200).json({
            message: "Contributions retrieved successfully",
            contributions: contributions,
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
exports.default = getContributions;
