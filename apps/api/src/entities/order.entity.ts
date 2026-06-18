import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PICKUP = 'pickup',
  WASHING = 'washing',
  COOKING = 'cooking',
  READY = 'ready',
  DONE = 'done',
  DELIVERED = 'delivered',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('jsonb')
  items: any;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  total: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  tableNumber: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column({ default: 'kasirku-main' })
  storeCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
