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
exports.disconnectFromDatabase = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../config/index"));
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!index_1.default.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }
    try {
        yield mongoose_1.default.connect(index_1.default.MONGO_URI, clientOptions);
        console.log("Connected to MongoDB successfully");
    }
    catch (_a) {
        console.log("Failed to connect to MongoDB");
        throw new Error("Failed to connect to MongoDB");
    }
});
exports.connectToDatabase = connectToDatabase;
const disconnectFromDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB successfully");
    }
    catch (err) {
        throw new Error("Failed to disconnect from MongoDB");
    }
});
exports.disconnectFromDatabase = disconnectFromDatabase;
