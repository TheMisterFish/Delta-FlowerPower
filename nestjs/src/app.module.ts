import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { TypegooseModule } from "nestjs-typegoose";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRoot((process.env.DEBUG_MODE === 'true' ? process.env.MONGO_CONNECTION_STRING_DEBUG : process.env.MONGO_CONNECTION_STRING_PROD), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    CommandModule,
    AuthModule, 
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
