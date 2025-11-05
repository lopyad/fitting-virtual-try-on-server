import { ApiError } from '../types/errors/error';
import Repository from '../repository/repository';
import * as fs from 'fs';
import { Product } from '../types/types';

export default class Service {
  constructor(private readonly repository: Repository){}

  async getAllProducts(): Promise<Product[]> {
    return this.repository.product.findAll();
  }

  async performTryOn(encodedUserImage: string, encodedProductImage: string): Promise<string> {
    try{
      const result = await this.repository.vtoApi.predict(encodedUserImage, encodedProductImage);

      const outputImage = result.predictions[0]?.bytesBase64Encoded;
      if (outputImage) {
        fs.writeFileSync('output.png', Buffer.from(outputImage, 'base64'));
        console.log('Generated image saved to output.png');
        return outputImage;
      } else {
        console.error('Prediction result did not contain an output image.', result);
        throw new Error('Failed to generate image from prediction.');
      }
    } 
    catch(e) {
      if(e instanceof ApiError){
        console.log(`[Service] ${e.message}`);
        throw e;
      }
      throw e;
    }
  }

  async performTryOnByGeminiFlashImage(encodedUserImage: string, encodedProductImage: string): Promise<string> {
    try{
      const result = await this.repository.vertexApi.predict("두 사진을 합성해서 Virtual-try-on을 구현해줘. 이미지를 생성해서 응답을 보내줘", encodedUserImage, encodedProductImage);
      const outputImage = result;
      if (outputImage) {
        fs.writeFileSync('output2.png', Buffer.from(outputImage, 'base64'));
        console.log('Generated image saved to output.png');
        return outputImage;
      } else {
        console.error('Prediction result did not contain an output image.', result);
        throw new Error('Failed to generate image from prediction.');
      }
    } 
    catch(e) {
      if(e instanceof ApiError){
        console.log(`[Service] ${e.message}`);
        throw e;
      }
      throw e;
    }
  }
}