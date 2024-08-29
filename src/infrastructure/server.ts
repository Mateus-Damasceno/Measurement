import express from 'express';
import { MeasurementService } from '../application/services/MeasurementService';
import { InMemoryMeasurementRepository } from './repositories/InMemoryMeasurementRepository';
import { MeasurementController } from './controllers/MeasurementController';

const app = express();
app.use(express.json());

const measurementRepository = new InMemoryMeasurementRepository();
const measurementService = new MeasurementService(measurementRepository);
const measurementController = new MeasurementController(measurementService);

app.post('/upload', (req, res) => measurementController.saveMeasurement(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});