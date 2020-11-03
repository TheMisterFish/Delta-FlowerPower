import { Module } from '@nestjs/common';
import { AimodelsService } from './aimodels.service';

@Module({
  providers: [AimodelsService]
})
export class AimodelsModule {}
