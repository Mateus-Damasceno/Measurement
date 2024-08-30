"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurement = void 0;
class Measurement {
    constructor(image, customerCode, measureDatetime, measureType, imageUrl, measureValue, measureUuid) {
        this.image = image;
        this.customerCode = customerCode;
        this.measureDatetime = measureDatetime;
        this.measureType = measureType;
        this.imageUrl = imageUrl;
        this.measureValue = measureValue;
        this.measureUuid = measureUuid;
    }
}
exports.Measurement = Measurement;
