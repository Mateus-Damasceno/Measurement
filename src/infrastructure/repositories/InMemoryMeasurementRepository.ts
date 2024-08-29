import { MeasurementRepository } from '../../domain/repositories/MeasurementRepository';
import { Measurement } from '../../domain/entities/Measurement';

export class InMemoryMeasurementRepository implements MeasurementRepository {
    private measurements: Measurement[] = [];

    async save(measurement: Measurement): Promise<void> {
        this.measurements.push(measurement);
    }
}