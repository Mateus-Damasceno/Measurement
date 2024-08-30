"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const MeasurementService_1 = require("../application/services/MeasurementService");
const InMemoryMeasurementRepository_1 = require("./repositories/InMemoryMeasurementRepository");
const MeasurementController_1 = require("./controllers/MeasurementController");
const GeminiService_1 = require("../application/services/GeminiService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const geminiService = new GeminiService_1.GeminiService(process.env.GEMINI_API_KEY || '');
const measurementRepository = new InMemoryMeasurementRepository_1.InMemoryMeasurementRepository();
const measurementService = new MeasurementService_1.MeasurementService(measurementRepository, geminiService);
const measurementController = new MeasurementController_1.MeasurementController(measurementService);
app.post('/upload', (req, res) => measurementController.uploadMeasurement(req, res));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
