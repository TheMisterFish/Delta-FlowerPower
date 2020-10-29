import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../schemas/user.schema';

import { UsersSeed } from './users.command';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, UsersSeed],
  exports: [UsersService, UsersSeed],
  controllers: [UsersController],
})
export class UsersModule {}