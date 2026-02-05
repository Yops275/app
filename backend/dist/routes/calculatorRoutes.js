"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculatorController_1 = require("../controllers/calculatorController");
const router = (0, express_1.Router)();
router.post('/calculate', calculatorController_1.calculatePackaging);
exports.default = router;
