// export type FuncResponse<T> = [T, null] | [null, Error];

export interface encodedImageRequest {
  encodedPersonImage: string;
  encodedProductImage: string;
}

export interface encodedImageResponse {
  success: boolean;
  encodedImage: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'tops' | 'bottoms';
  images: string[];
  stock: number;
}
