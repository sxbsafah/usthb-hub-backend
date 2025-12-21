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
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./config/index"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_2 = __importDefault(require("./routes/index"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = require("./lib/mongoose");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, express_rate_limit_1.default)({
    windowMs: 60000,
    limit: 60,
    legacyHeaders: false,
    standardHeaders: true,
    message: {
        error: "Too many requests, please try again later.",
    }
}));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || index_1.default.NODE_ENV === "development" || index_1.default.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`Cors Error: ${origin} is not allowed by CORS`), false);
        }
    }
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(index_2.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(index_1.default.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, mongoose_1.connectToDatabase)();
            console.log(`Server is running on http://localhost:${index_1.default.PORT}`);
        }));
    }
    catch (err) {
        console.log("Failed starting the server ", err);
        process.exit(1);
    }
}))();
const handleServerShutDown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.disconnectFromDatabase)();
        console.log("Shutting down server...");
        process.exit(0);
    }
    catch (err) {
        console.error("Error during server shutdown:", err);
        process.exit(1);
    }
});
process.on("SIGTERM", handleServerShutDown);
process.on("SIGINT", handleServerShutDown);
