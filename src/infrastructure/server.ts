import 'dotenv/config';
import express from 'express';
import { MeasurementService } from '../application/services/MeasurementService';
import { InMemoryMeasurementRepository } from './repositories/InMemoryMeasurementRepository';
import { MeasurementController } from './controllers/MeasurementController';
import { GeminiService } from '../application/services/GeminiService';

const app = express();
app.use(express.json());

const geminiService = new GeminiService(process.env.GEMINI_API_KEY || '');
const measurementRepository = new InMemoryMeasurementRepository();
const measurementService = new MeasurementService(measurementRepository, geminiService,3000);
const measurementController = new MeasurementController(measurementService);

app.post('/upload', (req, res) => measurementController.uploadMeasurement(req, res));
app.patch('/confirm', (req, res) => measurementController.confirmMeasurement(req, res));
app.get('/:customer_code/list', (req, res) => measurementController.listMeasurements(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});