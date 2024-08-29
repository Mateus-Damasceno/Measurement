export class Measurement {
    constructor(
        public image: string,
        public customerCode: string,
        public measureDatetime: Date,
        public measureType: 'WATER' | 'GAS'
    ) {}
}