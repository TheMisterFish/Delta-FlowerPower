import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpException, HttpStatus, Request } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto } from "./dto";
import { Location } from "./locations.model";
import { Roles } from 'src/common/interfaces/roles.interface';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Roles.researcher)
export class LocationsController {

  constructor(private readonly locationsService: LocationsService) { }

  @Post()
  async create(@Request() req, @Body() dto: CreateLocationDto) {
    dto.made_by = req.user;
    return await this.locationsService.create(dto);
  }

  @Get()
  async findAll(): Promise<Location[]> {
    return await this.locationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Location> {
    return await this.locationsService.findOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not find " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return await this.locationsService.update(id, dto).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not update " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @HasRoles(Roles.admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.locationsService.deleteOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not remove " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
