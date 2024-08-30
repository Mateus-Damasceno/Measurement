import { Measurement } from '../entities/Measurement';

export interface MeasurementRepository {
    save(measurement: Measurement): Promise<void>;
    findByMonthAndType(customerCode: string, measureDatetime: Date, measureType: 'WATER' | 'GAS'): Promise<Measurement | null>;
}