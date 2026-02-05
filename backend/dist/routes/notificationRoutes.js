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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, title, body } = req.body;
    if (!token || !title || !body) {
        return res.status(400).json({ message: 'Missing token, title, or body' });
    }
    const success = yield (0, notificationService_1.sendNotification)(token, title, body);
    if (success) {
        res.json({ message: 'Notification sent successfully' });
    }
    else {
        res.status(500).json({ message: 'Failed to send notification' });
    }
}));
exports.default = router;
