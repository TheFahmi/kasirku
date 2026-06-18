import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  findAll(storeCode: string = 'kasirku-main'): Promise<Customer[]> {
    return this.customersRepository.find({ where: { storeCode } });
  }

  findOne(id: string): Promise<Customer | null> {
    return this.customersRepository.findOneBy({ id });
  }

  async create(customerData: Partial<Customer>): Promise<Customer> {
    const customer = this.customersRepository.create(customerData);
    return this.customersRepository.save(customer);
  }

  async update(id: string, customerData: Partial<Customer>): Promise<Customer> {
    await this.customersRepository.update(id, customerData);
    return this.customersRepository.findOneBy({ id }) as Promise<Customer>;
  }

  async remove(id: string): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
