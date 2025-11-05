import { Request, Response } from 'express';
import Service from '../service/service';
import { encodedImageResponse, Product } from '../types/types';
import { ApiError } from '../types/errors/error';

export default class Controller {
  constructor(private readonly service: Service){}

  async getProducts(req: Request, res: Response) {
    try {
      const products: Product[] = await this.service.getAllProducts();
      return res.status(200).json({ success: true, products });
    } catch (e) {
      console.error('[Controller] Error fetching products:', e);
      return res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
  }

  async perfromTryOnGoogleVto(req: Request, res: Response) {
    const {encodedPersonImage, encodedProductImage} = req.body;
    if(!encodedPersonImage || !encodedProductImage){
      return res.status(400).json({ success: false, message: 'invalid body' });
    }

    try{
      const result = await this.service.performTryOn(encodedPersonImage, encodedProductImage);
      console.log("Seding Virtual Try-on result to client.");
      return res.status(200).json({success: true, encodedImage: result} as encodedImageResponse);
    } 
    catch(e){
      if(e instanceof ApiError){
        console.log(`[controller] ${e.message}`);
        return res.status(400).json({ success: false, message: `An error occured: ${e.message}` });
      }
      
      return res.status(500).json({ success: false, message: `An unknown error occured` });
   }
  }

  async perfromTryOnByGeminiFlashImage(req: Request, res: Response) {
    const {encodedPersonImage, encodedProductImage} = req.body;
    if(!encodedPersonImage || !encodedProductImage){
      return res.status(400).json({ success: false, message: 'invalid body' });
    }

    try{
      const result = await this.service.performTryOnByGeminiFlashImage(encodedPersonImage, encodedProductImage);
      console.log("Seding Virtual Try-on result to client.");
      return res.status(200).json({success: true, encodedImage: result} as encodedImageResponse);
    } 
    catch(e){
      if(e instanceof ApiError){
        console.log(`[controller] ${e.message}`);
        return res.status(400).json({ success: false, message: `An error occured: ${e.message}` });
      }
      
      return res.status(500).json({ success: false, message: `An unknown error occured` });
   }
  }
  
}
