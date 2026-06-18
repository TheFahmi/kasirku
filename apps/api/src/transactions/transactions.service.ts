import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  findOne(id: string): Promise<Transaction | null> {
    return this.transactionsRepository.findOneBy({ id });
  }

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(transactionData);
    return this.transactionsRepository.save(transaction);
  }

  async update(id: string, transactionData: Partial<Transaction>): Promise<Transaction> {
    await this.transactionsRepository.update(id, transactionData);
    return this.transactionsRepository.findOneBy({ id }) as Promise<Transaction>;
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }
}
