export class Measurement {
    constructor(
        public image: string,
        public customerCode: string,
        public measureDatetime: Date,
        public measureType: 'WATER' | 'GAS',
        public imageUrl: string,
        public measureValue: number,
        public measureUuid: string
    ) {}
}