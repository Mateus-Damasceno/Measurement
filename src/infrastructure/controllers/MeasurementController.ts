import { Request, Response } from 'express';
import { MeasurementService } from '../../application/services/MeasurementService';

export class MeasurementController {
    constructor(private measurementService: MeasurementService) {}

    async saveMeasurement(req: Request, res: Response): Promise<void> {
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        await this.measurementService.saveMeasurement(image, customer_code, new Date(measure_datetime), measure_type);
        res.status(201).send('Measurement saved');
    }
}