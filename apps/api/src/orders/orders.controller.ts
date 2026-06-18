import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('kitchen/active')
  getKitchenOrders() {
    return this.ordersService.getKitchenOrders();
  }

  @Get('queue/public')
  getQueueOrders() {
    return this.ordersService.getQueueOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() order: Partial<Order>) {
    return this.ordersService.create(order);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() order: Partial<Order>) {
    return this.ordersService.update(id, order);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
