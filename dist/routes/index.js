"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../routes/auth"));
const faculties_1 = __importDefault(require("../routes/faculties"));
const modules_1 = __importDefault(require("../routes/modules"));
const subModules_1 = __importDefault(require("../routes/subModules"));
const contributions_1 = __importDefault(require("../routes/contributions"));
const users_1 = __importDefault(require("../routes/users"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/faculties", faculties_1.default);
router.use("/modules", modules_1.default);
router.use("/submodules", subModules_1.default);
router.use("/contributions", contributions_1.default);
router.use("/users", users_1.default);
router.get("/", (request, response) => {
    return response.json({
        message: "API is live",
        status: "ok",
        version: "1.0.0",
        docs: "https://docs.usthb-9raya.kairos.com",
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
