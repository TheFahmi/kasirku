import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  no: string;

  @Column({ default: 'cash' })
  method: string;

  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column('decimal', { precision: 12, scale: 2 })
  cash: number;

  @Column('decimal', { precision: 12, scale: 2 })
  change: number;

  @Column('jsonb')
  items: any;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ nullable: true })
  customerId: string;

  @Column({ default: false })
  isDebt: boolean;

  @Column({ nullable: true })
  cashier: string;

  @Column({ default: 'kasirku-main' })
  storeCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
