import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [CommandModule, MongooseModule.forRoot('mongodb://localhost/flowerpower'), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
