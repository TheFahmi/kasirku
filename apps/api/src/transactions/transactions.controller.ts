import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Post()
  create(@Body() transaction: Partial<Transaction>) {
    return this.transactionsService.create(transaction);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() transaction: Partial<Transaction>) {
    return this.transactionsService.update(id, transaction);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
