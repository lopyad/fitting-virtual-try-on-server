// export type FuncResponse<T> = [T, null] | [null, Error];

export interface encodedImageRequest {
  encodedPersonImage: string;
  encodedProductImage: string;
}

export interface encodedImageResponse {
  success: boolean;
  encodedImage: string;
}