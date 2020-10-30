import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { TypegooseModule } from "nestjs-typegoose";

@Module({
  imports: [
    TypegooseModule.forRoot("mongodb://localhost:27017/flowerpower", {
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
