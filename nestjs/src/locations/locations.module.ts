import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { LocationsService } from './locations.service';
import { Location } from './locations.model';
import { LocationsController } from './locations.controller';

@Module({
  imports: [TypegooseModule.forFeature([Location])],
  providers: [LocationsService],
  controllers: [LocationsController],
})
export class LocationsModule {}
