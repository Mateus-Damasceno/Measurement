import { Request, Response } from 'express';
import { MeasurementService } from '../../application/services/MeasurementService';

export class MeasurementController {
    constructor(private measurementService: MeasurementService) {}

    async uploadMeasurement(req: Request, res: Response): Promise<void> {
        const { image, customer_code, measure_datetime, measure_type } = req.body;

        if (!image || !customer_code || !measure_datetime || !measure_type) {
            res.status(400).send({
                error_code: 'INVALID_DATA',
                error_description: 'Missing required fields'
            });
            return;
        }

        if (!['WATER', 'GAS'].includes(measure_type)) {
            res.status(400).send({
                error_code: 'INVALID_DATA',
                error_description: 'Invalid measure type'
            });
            return;
        }

        try {
            const result = await this.measurementService.saveMeasurement(
                image,
                customer_code,
                new Date(measure_datetime),
                measure_type
            );
            res.status(200).send(result);
        } catch (error) {
            const errorMessage = (error as Error).message;
            if (
                errorMessage === 'Invalid base64 string' ||
                errorMessage === 'Invalid customer code' ||
                errorMessage === 'Invalid measure datetime' ||
                errorMessage === 'Invalid measure type'
            ) {
                res.status(400).send({
                    error_code: 'INVALID_DATA',
                    error_description: errorMessage
                });
            } else if (errorMessage === 'Measurement already exists for this month and type') {
                res.status(409).send({
                    error_code: 'DOUBLE_REPORT',
                    error_description: 'Leitura do mês já realizada'
                });
            } else {
                res.status(500).send({
                    error_code: 'INTERNAL_ERROR',
                    error_description: 'An unexpected error occurred'
                });
            }
        }
    }
}