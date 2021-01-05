import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SessionsService } from './sessions.service';
import { Session } from './sessions.model';
import { SessionsController } from './sessions.controller';
import { Research } from 'src/researches/researches.model';

@Module({
  imports: [TypegooseModule.forFeature([Session, Research])],
  providers: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
