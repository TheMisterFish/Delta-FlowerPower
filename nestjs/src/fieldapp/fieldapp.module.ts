import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { File } from 'src/common/models/file/file.model';
import { FieldappController } from './fieldapp.controller';
import { FieldappService } from './fieldapp.service';

@Module({
  providers: [FieldappService],
  controllers: [FieldappController],
  imports: [TypegooseModule.forFeature([File])],
})
export class FieldappModule {}
