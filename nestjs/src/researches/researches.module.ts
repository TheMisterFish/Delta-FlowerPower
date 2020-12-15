import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Research } from './researches.model';
import { ResearchesService } from './researches.service';
import { ResearchesController } from './researches.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([Research])
  ],
  providers: [ResearchesService],
  controllers: [ResearchesController],
})

export class ResearchesModule {}
