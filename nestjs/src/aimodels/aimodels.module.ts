import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { AimodelsService } from './aimodels.service';
import { Aimodel } from './aimodels.model';
import { AimodelsController } from './aimodels.controller';
import { File } from 'src/common/models/file/file.model';

@Module({
  imports: [TypegooseModule.forFeature([Aimodel, File])],
  providers: [AimodelsService],
  exports: [AimodelsService],
  controllers: [AimodelsController],
})
export class AimodelsModule {}
