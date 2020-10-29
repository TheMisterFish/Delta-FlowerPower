import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto';

import { UsersSeed } from './users.command';

@Module({
  imports: [TypegooseModule.forFeature([CreateUserDto])],
  providers: [UsersService, UsersSeed],
  exports: [UsersService, UsersSeed],
  controllers: [UsersController],
})
export class UsersModule {}