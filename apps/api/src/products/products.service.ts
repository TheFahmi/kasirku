import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  findAll(storeCode: string = 'kasirku-main'): Promise<Product[]> {
    return this.productsRepository.find({ where: { storeCode } });
  }

  findOne(id: string): Promise<Product | null> {
    return this.productsRepository.findOneBy({ id });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, productData);
    return this.productsRepository.findOneBy({ id }) as Promise<Product>;
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
