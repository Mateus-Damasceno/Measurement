export class MeasurementDTO {
    constructor(
        public image_url: string,
        public measure_value: number,
        public measure_uuid: string
    ) {}
}