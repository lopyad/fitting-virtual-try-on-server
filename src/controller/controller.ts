import { Request, Response } from 'express';
import Service from '../service/service';
import { encodedImageResponse } from '../types/types';
import { ApiError } from '../types/errors/error';

export default class Controller {
  constructor(private readonly service: Service){}

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
  // async performTryOn(req: Request, res: Response) {
  //   try {
  //     const { userImageUri, garmentImageUri } = req.body;

  //     if (!userImageUri || !garmentImageUri) {
  //       return res.status(400).json({ message: 'userImageUri and garmentImageUri are required in the request body.' });
  //     }

  //     const result = await this.service.performTryOn(userImageUri, garmentImageUri);

  //     if (result.success) {
  //       res.status(200).json(result);
  //     } else {
  //       res.status(500).json(result);
  //     }
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  //     res.status(500).json({ message: errorMessage });
  //   }
  // }
}
