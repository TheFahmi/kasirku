import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  quota: number;

  @Column({ default: 'kasirku-main' })
  storeCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
