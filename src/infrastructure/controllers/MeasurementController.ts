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

    async confirmMeasurement(req: Request, res: Response): Promise<void> {
        const { measure_uuid, confirmed_value } = req.body;

        if (!measure_uuid || typeof confirmed_value !== 'number') {
            res.status(400).send({
                error_code: 'INVALID_DATA',
                error_description: 'Missing or invalid required fields'
            });
            return;
        }

        try {
            await this.measurementService.confirmMeasurement(measure_uuid, confirmed_value);
            res.status(200).send({ success: true });
        } catch (error) {
            const errorMessage = (error as Error).message;
            if (errorMessage === 'Measurement not found') {
                res.status(404).send({
                    error_code: 'MEASURE_NOT_FOUND',
                    error_description: errorMessage
                });
            } else if (errorMessage === 'Measurement already confirmed') {
                res.status(409).send({
                    error_code: 'CONFIRMATION_DUPLICATE',
                    error_description: errorMessage
                });
            } else {
                res.status(500).send({
                    error_code: 'INTERNAL_ERROR',
                    error_description: 'An unexpected error occurred'
                });
            }
        }
    }

    async listMeasurements(req: Request, res: Response): Promise<void> {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        if (measure_type && !['WATER', 'GAS'].includes((measure_type as string).toUpperCase())) {
            res.status(400).send({
                error_code: 'INVALID_TYPE',
                error_description: 'Tipo de medição não permitida'
            });
            return;
        }

        try {
            const measurements = await this.measurementService.listMeasurements(customer_code, measure_type as 'WATER' | 'GAS');
            if (measurements.length === 0) {
                res.status(404).send({
                    error_code: 'MEASURES_NOT_FOUND',
                    error_description: 'Nenhuma leitura encontrada'
                });
                return;
            }

            res.status(200).send({
                customer_code,
                measures: measurements.map(m => ({
                    measure_uuid: m.measureUuid,
                    measure_datetime: m.measureDatetime,
                    measure_type: m.measureType,
                    has_confirmed: m.confirmed,
                    image_url: m.imageUrl
                }))
            });
        } catch (error) {
            res.status(500).send({
                error_code: 'INTERNAL_ERROR',
                error_description: 'An unexpected error occurred'
            });
        }
    }
}