import { Controller, Get, Post, Body, Put, Param, Delete, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdatePassword, UpdateUserDto } from './dto';
import { User } from './users.model';
import { UsersService } from './users.service';

import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { Roles } from 'src/common/interfaces/roles.interface';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Roles.researcher)
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @HasRoles(Roles.admin)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get()
  async findAll(): Promise<User[]> {
      return await this.usersService.findAll().catch(err => {
        throw new HttpException({
          message: err.message
        }, HttpStatus.BAD_REQUEST);
      });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not find " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto).catch(err => {
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
    return await this.usersService.deleteOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not remove " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @HasRoles(Roles.guest)
  @Post('/change_password')
  async changePassword(@Request() req, @Body() updatePasswordDto: UpdatePassword) {
    return await this.usersService.changePassword(req.user, updatePasswordDto).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not update password";
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
