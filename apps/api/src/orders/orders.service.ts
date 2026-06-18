import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  findAll(storeCode: string = 'kasirku-main'): Promise<Order[]> {
    return this.ordersRepository.find({ where: { storeCode } });
  }

  getKitchenOrders(storeCode: string = 'kasirku-main'): Promise<Order[]> {
    return this.ordersRepository.createQueryBuilder('order')
      .where('order.status IN (:...statuses)', { statuses: ['pending', 'cooking'] })
      .andWhere('order.storeCode = :storeCode', { storeCode })
      .orderBy('order.createdAt', 'ASC')
      .getMany();
  }

  getQueueOrders(storeCode: string = 'kasirku-main'): Promise<Order[]> {
    return this.ordersRepository.createQueryBuilder('order')
      .where('order.status IN (:...statuses)', { statuses: ['cooking', 'ready'] })
      .andWhere('order.storeCode = :storeCode', { storeCode })
      .orderBy('order.createdAt', 'ASC')
      .getMany();
  }

  findOne(id: string): Promise<Order | null> {
    return this.ordersRepository.findOneBy({ id });
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.ordersRepository.create(orderData);
    return this.ordersRepository.save(order);
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order> {
    await this.ordersRepository.update(id, orderData);
    return this.ordersRepository.findOneBy({ id }) as Promise<Order>;
  }

  async remove(id: string): Promise<void> {
    await this.ordersRepository.delete(id);
  }
}
