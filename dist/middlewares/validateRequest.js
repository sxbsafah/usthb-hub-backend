"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validateRequest = (request, response, next) => {
    const result = (0, express_validator_1.validationResult)(request);
    if (!result.isEmpty()) {
        return response.status(400).json({
            code: "ValidationError",
            message: "Invalid Request Data",
            errors: result.mapped(),
        });
    }
    next();
};
exports.default = validateRequest;
