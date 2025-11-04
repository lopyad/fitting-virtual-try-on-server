import {
  FunctionDeclarationSchemaType,
  GenerateContentRequest,
  GenerativeModel,
  GenerativeModelPreview,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} from '@google-cloud/vertexai';
import { config } from '../config/config';

const { projectId, location } = config.googleCloud;
const { geminiFlashImage } = config.models;

export default class GeminiApi {
  private vertexAI: VertexAI;
  private generativeModel: GenerativeModel;
  constructor() {
    if (!projectId) {
      throw new Error("Missing required environment variables: GOOGLE_PROJECT_ID");
    }
    this.vertexAI = new VertexAI({
      project: projectId,
      location: location,
    });
    // Instantiate Gemini models
    this.generativeModel = this.vertexAI.getGenerativeModel({
      model: geminiFlashImage,
      // The following parameters are optional
      // They can also be passed to individual content generation requests
      // safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
      // generationConfig: { maxOutputTokens: 256 },
      // systemInstruction: {
      //   role: 'system',
      //   parts: [{ "text": `For example, you are a helpful customer service agent.` }]
      // },
    });
  }

  async predict(prompt: string, encodedUserImage: string, encodedProductImage: string): Promise<string> {
    try{
      const contents = [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/png", data: encodedUserImage } },
            { inlineData: { mimeType: "image/png", data: encodedProductImage } },
            { text: prompt },
          ],
        },
      ];

      const result = await this.generativeModel.generateContent({ contents });
      // const contentResponse = await streamingResult.response;
      // console.log(contentResponse.candidates![0]?.content.parts[0]!.text);
      return result.response.candidates![0]!.content.parts[0]!.inlineData!.data;
      // console.log(result.response.candidates![0]?.content.parts);
      // return "1111";     
    } catch(e){
      console.log(e);
      throw e;
    }

  }

  async streamGenerateContent() {
    try {
      const request = {
        contents: [{ role: 'user', parts: [{ text: 'How are you doing today?' }] }],
      };
      const streamingResult = await this.generativeModel.generateContentStream(request);
      for await (const item of streamingResult.stream) {
        console.log('stream chunk: ', JSON.stringify(item));
      }
      const aggregatedResponse = await streamingResult.response;
      console.log('aggregated response: ', JSON.stringify(aggregatedResponse));
    } catch (e) {
      throw e;
    }
  };

  async generateContent() {
    const request = {
      contents: [{ role: 'user', parts: [{ text: 'How are you doing today?' }] }],
    };
    const result = await this.generativeModel.generateContent(request);
    const response = result.response;
    console.log('Response: ', JSON.stringify(response));
  };

  async generateContentWithImage(prompt: string, encodedImage: string) {
    const request: GenerateContentRequest = {
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: encodedImage } }
        ],
      }],
    };
    console.log("Send request to Gemini");
    try {
      // 콘텐츠 생성 요청 및 응답 대기
      const result = await this.generativeModel.generateContent(request);
      const response = result.response;

      // 결과 출력
      console.log('---------------------------------');
      console.log('response of gemini:');
      console.log(response.candidates?.[0]!.content?.parts?.[0]!.text);
      console.log('---------------------------------');

    } catch (error) {
      console.error('API 요청 중 오류가 발생했습니다:', error);
    }

  }
}