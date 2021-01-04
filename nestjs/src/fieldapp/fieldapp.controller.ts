import {
    Controller,
    Get,
    UseGuards,
  } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { FieldappService } from './fieldapp.service';
// import * as fs from 'fs';
// import { join } from 'path';
import { Roles } from '../common/interfaces/roles.interface';

@Controller('fieldapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Roles.researcher)
export class FieldappController {
constructor(private readonly fieldappService: FieldappService) {}
    @Get()
    async findAll(): Promise<any[]> {
        return await this.fieldappService.findAll();
    }
}