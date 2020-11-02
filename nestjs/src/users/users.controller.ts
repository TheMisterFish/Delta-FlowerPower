import { Controller, Get, Post, Body, Put, Param, Delete, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdatePassword, UpdateUserDto } from './dto';
import { User } from './users.model';
import { UsersService } from './users.service';

import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Get()
  async findAll(): Promise<User[]> {
      return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('guest')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('guest')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
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

  @UseGuards(JwtAuthGuard)
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
