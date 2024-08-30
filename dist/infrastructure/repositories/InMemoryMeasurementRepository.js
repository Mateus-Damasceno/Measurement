"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMeasurementRepository = void 0;
class InMemoryMeasurementRepository {
    constructor() {
        this.measurements = [];
    }
    save(measurement) {
        return __awaiter(this, void 0, void 0, function* () {
            this.measurements.push(measurement);
        });
    }
    findByMonthAndType(customerCode, measureDatetime, measureType) {
        return __awaiter(this, void 0, void 0, function* () {
            const month = measureDatetime.getMonth();
            const year = measureDatetime.getFullYear();
            return this.measurements.find(m => m.customerCode === customerCode &&
                m.measureType === measureType &&
                m.measureDatetime.getMonth() === month &&
                m.measureDatetime.getFullYear() === year) || null;
        });
    }
}
exports.InMemoryMeasurementRepository = InMemoryMeasurementRepository;
