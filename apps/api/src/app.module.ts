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

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5435),
        username: configService.get<string>('DB_USERNAME', 'kasirku'),
        password: configService.get<string>('DB_PASSWORD', 'password123'),
        database: configService.get<string>('DB_DATABASE', 'kasirku'),
        entities: [Customer, Product, Transaction, Order, Tenant],
        synchronize: true, // Auto create schemas
      }),
      inject: [ConfigService],
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
