import { MeasurementRepository } from '../../domain/repositories/MeasurementRepository';
import { Measurement } from '../../domain/entities/Measurement';

export class InMemoryMeasurementRepository implements MeasurementRepository {
    private measurements: Measurement[] = [];

    async save(measurement: Measurement): Promise<void> {
        this.measurements.push(measurement);
    }

    async findByMonthAndType(customerCode: string, measureDatetime: Date, measureType: 'WATER' | 'GAS'): Promise<Measurement | null> {
        const month = measureDatetime.getMonth();
        const year = measureDatetime.getFullYear();
        return this.measurements.find(m => 
            m.customerCode === customerCode && 
            m.measureType === measureType && 
            m.measureDatetime.getMonth() === month && 
            m.measureDatetime.getFullYear() === year
        ) || null;
    }
}