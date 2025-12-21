"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = __importDefault(require("../controllers/auth/register"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const validators_1 = require("../validators/validators");
const login_1 = __importDefault(require("../controllers/auth/login"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const logout_1 = __importDefault(require("../controllers/auth/logout"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    return res.json({
        message: "Auth route is live",
        status: "ok",
    });
});
router.post("/register", validators_1.emailValidator, validators_1.firstNameValidator, validators_1.lastNameValidator, validators_1.passwordValidator, validateRequest_1.default, register_1.default);
router.post("/login", validators_1.loginEmailValidator, validators_1.loginPasswordValidator, validateRequest_1.default, login_1.default);
router.get("/logout", (0, authenticate_1.default)("user"), logout_1.default);
exports.default = router;
