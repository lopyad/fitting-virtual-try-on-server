import fs from 'fs/promises';
import path from 'path';
import { Product } from '../types/types';
import { IProductRepository } from './product';

export class FileProductRepository implements IProductRepository {
  private readonly filePath = path.join(process.cwd(), 'data', 'products.json');

  private async _readData(): Promise<Product[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as Product[];
    } catch (error) {
      // 파일이 없거나 비어있을 경우 빈 배열 반환
      return [];
    }
  }

  async findAll(): Promise<Product[]> {
    return this._readData();
  }

  async findById(id: string): Promise<Product | undefined> {
    const products = await this._readData();
    return products.find(p => p.id === id);
  }

  async findByCategory(category: 'tops' | 'bottoms'): Promise<Product[]> {
    const products = await this._readData();
    return products.filter(p => p.category === category);
  }
}
