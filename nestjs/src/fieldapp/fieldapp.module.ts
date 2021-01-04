import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { FieldappService } from './fieldapp.service';
import { FieldappController } from './fieldapp.controller';
import { File } from 'src/common/models/file/file.model';

@Module({
    imports: [TypegooseModule.forFeature([File])],
  providers: [FieldappService],
  exports: [FieldappService],
  controllers: [FieldappController],
})
export class FieldappModule {}
