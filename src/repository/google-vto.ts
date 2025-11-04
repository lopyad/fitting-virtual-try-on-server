import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { ApiResponse, VirtualTryOnInstance, VirtualTryOnParameters } from '../types/google-api.types';
import { ApiError } from '../types/errors/error';
import { config } from '../config/config';

const { projectId, location } = config.googleCloud;
const { virtualTryOn } = config.models;

if (!projectId) {
  throw new Error('Missing required environment variable: GOOGLE_CLOUD_PROJECT_ID');
}

const API_ENDPOINT = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${virtualTryOn}:predict`;

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export default class GoogleApi {
  async predict(encodedUserImage: string, encodedProductImage: string): Promise<ApiResponse> {
    console.log('Sending prediction request to Virtual Try-on API...');

    const accessToken = await auth.getAccessToken();

    const instances: VirtualTryOnInstance[] = [
      {
        personImage: {
          image: {
            bytesBase64Encoded: encodedUserImage
          }
        },
        productImages: [
          {
            image: {
              bytesBase64Encoded: encodedProductImage
            }
          }
        ]
      }
    ];

    const parameters: VirtualTryOnParameters = {
      baseSteps: 30,
      sampleCount: 1,
      personGeneration: "allow_all"
    };

    const requestBody = { instances, parameters };

    try {
      const response = await axios.post<ApiResponse>(API_ENDPOINT, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Successfully received prediction response.');
      return response.data;
    } 
    catch (error) {
      console.error('Error calling Virtual Try-on API:', error)
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || 'Failed to get virtual try-on prediction.';
        throw new ApiError(message, status);
      }

      throw new Error('An unexpected error occurred during the API call.');
    }
  }
}