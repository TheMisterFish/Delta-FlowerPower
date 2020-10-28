import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }


  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll(@Query() query: ListAllEntities) {
  //     return `This action returns all cats (limit: ${query.limit} items)`;
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
