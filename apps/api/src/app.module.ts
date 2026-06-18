import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';
import { Transaction } from './entities/transaction.entity';
import { Order } from './entities/order.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'kasirku',
      password: 'password123',
      database: 'kasirku',
      entities: [Customer, Product, Transaction, Order],
      synchronize: true, // Auto-create tables (Dev only)
    }),
    TypeOrmModule.forFeature([Customer, Product, Transaction, Order]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
