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
exports.MeasurementService = void 0;
const uuid_1 = require("uuid");
const Measurement_1 = require("../../domain/entities/Measurement");
const validators_1 = require("../../utils/validators");
const MeasurementDTO_1 = require("../dto/MeasurementDTO");
class MeasurementService {
    constructor(measurementRepository, geminiService) {
        this.measurementRepository = measurementRepository;
        this.geminiService = geminiService;
    }
    saveMeasurement(image, customerCode, measureDatetime, measureType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, validators_1.isValidBase64)(image)) {
                throw new Error('Invalid base64 string');
            }
            const textAnnotations = yield this.geminiService.analyzeImage(image);
            const measureValue = this.extractMeasureValue(textAnnotations);
            const imageUrl = this.generateUrl(image);
            const measureUuid = (0, uuid_1.v4)();
            const measurement = new Measurement_1.Measurement(image, customerCode, measureDatetime, measureType, imageUrl, measureValue, measureUuid);
            yield this.measurementRepository.save(measurement);
            return new MeasurementDTO_1.MeasurementDTO(imageUrl, measureValue, measureUuid);
        });
    }
    extractMeasureValue(textAnnotations) {
        var _a;
        const text = ((_a = textAnnotations[0]) === null || _a === void 0 ? void 0 : _a.description) || '0';
        const numbers = text.match(/\d+/g);
        if (numbers && numbers.length > 0) {
            return parseFloat(numbers.join(''));
        }
        return 0;
    }
    generateUrl(base64Image) {
        const uniqueId = (0, uuid_1.v4)();
        return "http://localhost:4000/${uniqueId}.jpg";
    }
}
exports.MeasurementService = MeasurementService;
