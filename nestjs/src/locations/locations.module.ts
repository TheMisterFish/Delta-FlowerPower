import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Module({
  providers: [LocationsService]
})
export class LocationsModule {}
