import { Product } from '../types/types';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | undefined>;
  findByCategory(category: 'tops' | 'bottoms'): Promise<Product[]>;
}
