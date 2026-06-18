import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';
import { Transaction } from './entities/transaction.entity';
import { Order } from './entities/order.entity';
import { Tenant } from './entities/tenant.entity';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { OrdersModule } from './orders/orders.module';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'kasirku',
      password: 'password123',
      database: 'kasirku',
      entities: [Customer, Product, Transaction, Order, Tenant],
      synchronize: true, // Auto create schemas
    }),
    ProductsModule,
    CustomersModule,
    TransactionsModule,
    OrdersModule,
    TenantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
