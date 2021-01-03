import { Module } from '@nestjs/common';
import { FieldappService } from './fieldapp.service';

@Module({
  providers: [FieldappService]
})
export class FieldappModule {}
