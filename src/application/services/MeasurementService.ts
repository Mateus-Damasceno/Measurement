import { v4 as uuidv4 } from 'uuid';
import { MeasurementRepository } from '../../domain/repositories/MeasurementRepository';
import { Measurement } from '../../domain/entities/Measurement';
import { GeminiService } from './GeminiService';
import { isValidBase64 } from '../../utils/validators';
import { MeasurementDTO } from '../dto/MeasurementDTO';
import fs from 'fs';
import path from 'path';


export class MeasurementService {
    constructor(
        private readonly measurementRepository: MeasurementRepository,
        private readonly geminiService: GeminiService,
        private readonly port: number
    ) {}

    async saveMeasurement(
        image: string,
        customerCode: string,
        measureDatetime: Date,
        measureType: 'WATER' | 'GAS'
    ): Promise<MeasurementDTO> {
        if (!isValidBase64(image)) {
            throw new Error('Invalid base64 string');
        }

        const textAnnotations = await this.geminiService.analyzeImage(image);
        const measureValue = this.extractMeasureValue(textAnnotations);
        const imageUrl = await this.generateUrl(image);
        const measureUuid = uuidv4();
        const measurement = new Measurement(
            image,
            customerCode,
            measureDatetime,
            measureType,
            imageUrl,
            measureValue,
            measureUuid
        );

        await this.measurementRepository.save(measurement);
        return new MeasurementDTO(imageUrl, measureValue, measureUuid);
    }

    private extractMeasureValue(textAnnotations: any[]): number {
        let potentialValues: number[] = [];

        textAnnotations.forEach(annotation => {
            const text = annotation.description || '';
            const numbers = text.match(/\d+/g);

            if (numbers && numbers.length > 0) {
                // Especifica explicitamente que 'num' é do tipo 'string'
                numbers.forEach((num: string) => {
                    // Ignora números muito curtos ou longos que podem não ser a leitura do hidrômetro
                    if (num.length >= 4 && num.length <= 8) {
                        potentialValues.push(parseFloat(num));
                    }
                });
            }
        });

        // Assumindo que o maior número é o que representa a leitura do hidrômetro
        return potentialValues.length > 0 ? Math.max(...potentialValues) : 0;
    }

    private async generateUrl(base64Image: string): Promise<string> {
        const uniqueId = uuidv4();
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const fileName = `${uniqueId}.jpg`;
        const imagesDir = path.join(__dirname, 'images',fileName);
        // Cria a pasta 'images' se ela não existir
        if (!fs.existsSync(imagesDir)) {
            await fs.promises.mkdir(imagesDir, { recursive: true });
        }

        const filePath = path.join(imagesDir, fileName);
        await fs.promises.writeFile(filePath, imageBuffer);

        return `http://localhost:${this.port}/images/${fileName}`;
    }
}