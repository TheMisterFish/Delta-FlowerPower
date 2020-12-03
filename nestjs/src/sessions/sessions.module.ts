import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SessionsService } from './sessions.service';
import { Session } from './sessions.model';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([Session])
  ],
  providers: [SessionsService],
  exports: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
