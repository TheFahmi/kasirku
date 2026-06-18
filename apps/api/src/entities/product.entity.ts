import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 'pcs' })
  unit: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  type: string;

  @Column('jsonb', { nullable: true })
  variants: any;

  @CreateDateColumn()
  createdAt: Date;
}
