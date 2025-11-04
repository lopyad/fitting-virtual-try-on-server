export interface VirtualTryOnInstance {
  personImage: {
    image: {
      bytesBase64Encoded: string;
      // gcsUri?: string;
    }
  };
  productImages: {
    image: {
      bytesBase64Encoded: string;
    }
  }[];
}

export interface VirtualTryOnParameters {
    addWatermark?: boolean;
    baseSteps: number;
    personGeneration?: string;
    safetySetting?: string;
    sampleCount: 1 | 2 | 3 | 4;
    seed?: number;
    storageUri?: string;
    outputOptions?: {
      mimeType: string;
      compressionQuality: number;
    }
}

export interface Prediction {
  mimeType: string;
  bytesBase64Encoded: string;
}

export interface ApiResponse {
  predictions: Prediction[];
}
