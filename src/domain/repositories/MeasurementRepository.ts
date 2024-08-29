import { Measurement } from '../entities/Measurement';

export interface MeasurementRepository {
    save(measurement: Measurement): Promise<void>;
}