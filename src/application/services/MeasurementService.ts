import { MeasurementRepository } from '../../domain/repositories/MeasurementRepository';
import { Measurement } from '../../domain/entities/Measurement';

export class MeasurementService {
    constructor(private measurementRepository: MeasurementRepository) {}

    async saveMeasurement(
        image: string,
        customerCode: string,
        measureDatetime: Date,
        measureType: 'WATER' | 'GAS'
    ): Promise<void> {
        const measurement = new Measurement(image, customerCode, measureDatetime, measureType);
        await this.measurementRepository.save(measurement);
    }
}