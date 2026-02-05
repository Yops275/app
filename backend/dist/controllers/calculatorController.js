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
exports.calculatePackaging = void 0;
const database_1 = __importDefault(require("../config/database"));
const calculateVolume = (dims) => dims.length * dims.width * dims.height;
const calculatePackaging = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = req.body.items;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid items provided' });
        }
        // 1. Calculate Total Volume required
        let totalVolume = 0;
        let maxDimension = 0;
        items.forEach(item => {
            totalVolume += calculateVolume(item) * item.quantity;
            maxDimension = Math.max(maxDimension, item.length, item.width, item.height);
        });
        // 2. Fetch available boxes
        // In a real scenario, we might caching this or use more advanced DB filtering
        const result = yield database_1.default.query("SELECT * FROM products WHERE category = 'Box'");
        const boxes = result.rows;
        // 3. Find suitable boxes
        const candidates = boxes.filter(box => {
            const boxDims = box.dimensions;
            const boxVolume = calculateVolume(boxDims);
            // Basic Volume check
            if (boxVolume < totalVolume)
                return false;
            // Basic Dimension check (Diagonal fit approximation for longest item)
            // This is a naive heuristic. Real packaging algorithms are complex (Bin Packing Problem).
            const boxMaxDim = Math.max(boxDims.length, boxDims.width, boxDims.height);
            if (boxMaxDim < maxDimension)
                return false;
            return true;
        });
        // 4. Sort by smallest volume (Best Fit)
        candidates.sort((a, b) => {
            const volA = calculateVolume(a.dimensions);
            const volB = calculateVolume(b.dimensions);
            return volA - volB;
        });
        const bestFit = candidates.length > 0 ? candidates[0] : null;
        res.json({
            recommendedBox: bestFit,
            totalVolume,
            candidatesCount: candidates.length,
            message: bestFit ? 'Optimal box found' : 'No suitable box found in catalog'
        });
    }
    catch (error) {
        console.error('Calculator error:', error);
        res.status(500).json({ message: 'Calculation failed' });
    }
});
exports.calculatePackaging = calculatePackaging;
