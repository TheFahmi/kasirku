import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from '../entities/tenant.entity';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Post()
  create(@Body() tenant: Partial<Tenant>) {
    return this.tenantsService.create(tenant);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
