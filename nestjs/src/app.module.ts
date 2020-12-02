import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { TypegooseModule } from 'nestjs-typegoose';
import { SessionsController } from './sessions/sessions.controller';
import { SessionsModule } from './sessions/sessions.module';
import { AimodelsController } from './aimodels/aimodels.controller';
import { AimodelsModule } from './aimodels/aimodels.module';
import { LocationsController } from './locations/locations.controller';
import { LocationsModule } from './locations/locations.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRoot(
      process.env.DEBUG_MODE === 'true'
        ? process.env.MONGO_CONNECTION_STRING_DEBUG
        : process.env.MONGO_CONNECTION_STRING_PROD,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    MulterModule.register({
      storage: diskStorage({
        destination: function(req, file, cb) {
          const path = join('public', 'files', 'researches', req.params.id);
          if (!existsSync(path)) mkdirSync(path);
          cb(null, path);
        },
        filename: function(req, file, cb) {
          cb(null, join(file.originalname));
        },
      }),
    }),
    CommandModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    AimodelsModule,
    LocationsModule,
  ],
  controllers: [
    AppController,
    SessionsController,
    AimodelsController,
    LocationsController,
  ],
  providers: [AppService],
})
export class AppModule {}
