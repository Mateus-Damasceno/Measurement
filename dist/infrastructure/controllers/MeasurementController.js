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
exports.MeasurementController = void 0;
class MeasurementController {
    constructor(measurementService) {
        this.measurementService = measurementService;
    }
    uploadMeasurement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield this.measurementService.saveMeasurement(image, customer_code, new Date(measure_datetime), measure_type);
                res.status(201).send(result);
            }
            catch (error) {
                const errorMessage = error.message;
                if (errorMessage === 'Invalid base64 string' ||
                    errorMessage === 'Invalid customer code' ||
                    errorMessage === 'Invalid measure datetime' ||
                    errorMessage === 'Invalid measure type') {
                    res.status(400).send({
                        error_code: 'INVALID_DATA',
                        error_description: errorMessage
                    });
                }
                else if (errorMessage === 'Measurement already exists for this month and type') {
                    res.status(409).send({
                        error_code: 'DOUBLE_REPORT',
                        error_description: 'Leitura do mês já realizada'
                    });
                }
                else {
                    res.status(500).send({
                        error_code: 'INTERNAL_ERROR',
                        error_description: 'An unexpected error occurred'
                    });
                }
            }
        });
    }
}
exports.MeasurementController = MeasurementController;
