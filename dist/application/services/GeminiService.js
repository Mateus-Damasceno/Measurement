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
exports.GeminiService = void 0;
const vision_1 = require("@google-cloud/vision");
class GeminiService {
    constructor(apiKey) {
        this.client = new vision_1.ImageAnnotatorClient({ key: apiKey });
    }
    analyzeImage(base64Image) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.client.annotateImage({
                image: { content: base64Image },
                features: [{ type: 'TEXT_DETECTION' }],
            });
            return result.textAnnotations || [];
        });
    }
}
exports.GeminiService = GeminiService;
