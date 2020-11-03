import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpException, HttpStatus, Request } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto, LocationsDto } from "./dto";
import { Location } from "./locations.model";

@Controller('locations')
export class LocationsController {

  constructor(private readonly locationsService: LocationsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Post()
  async create(@Request() req, @Body() createLocationDto: CreateLocationDto) {
    createLocationDto.made_by = req.id;
    return await this.locationsService.create(createLocationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Get()
  async findAll(): Promise<Location[]> {
    return await this.locationsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LocationsDto> {
    return await this.locationsService.findOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not find " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return await this.locationsService.update(id, updateLocationDto).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not update " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
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
