import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum TenantType {
  RESTO = 'resto',
  LAUNDRY = 'laundry',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  storeCode: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TenantType, default: TenantType.RESTO })
  type: TenantType;

  @Column({ nullable: true })
  ownerId: string; // To group multiple branches under one company/owner

  @Column({ default: 'active' })
  subscriptionStatus: string; // active, expired, trial

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @CreateDateColumn()
  createdAt: Date;
}
