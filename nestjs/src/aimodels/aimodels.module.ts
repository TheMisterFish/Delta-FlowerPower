import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { AimodelsService } from './aimodels.service';
import { Aimodel } from './aimodels.model';
import { AimodelsController } from './aimodels.controller';

@Module({
  imports: [TypegooseModule.forFeature([Aimodel])],
  providers: [AimodelsService],
  exports: [AimodelsService],
  controllers: [AimodelsController],
})
export class AimodelsModule {}
