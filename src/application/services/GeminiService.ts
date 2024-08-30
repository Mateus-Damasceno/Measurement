import { ImageAnnotatorClient } from '@google-cloud/vision';


export class GeminiService {
    private client: ImageAnnotatorClient;

    constructor(apiKey: string) {
        this.client = new ImageAnnotatorClient({ key: apiKey });
    }

    async analyzeImage(base64Image: string): Promise<any[]> {
        const [result] = await this.client.annotateImage({
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION' }],
        });
        return result.textAnnotations || [];
    }
}