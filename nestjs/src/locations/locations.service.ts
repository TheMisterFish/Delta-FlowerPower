import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { CreateLocationDto, UpdateLocationDto, LocationsDto } from './dto';

import { Location } from "./locations.model";

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location) private readonly locationModel: ReturnModelType<typeof LocationsDto>
  ) { }

  async findOne(id: string): Promise<LocationsDto> | null {
    return await this.locationModel.findById(id).populate('made_by').exec();
  }

  async findAll(): Promise<LocationsDto[] | null> {
    return await this.locationModel.find().populate('made_by').exec();
  }

  async create(dto: CreateLocationDto): Promise<LocationsDto> {
    const createdLocation = new this.locationModel(dto);
    return await createdLocation.save();
  }

  async update(id: string, dto: UpdateLocationDto): Promise<LocationsDto> {
    dto.updated_at = new Date();
    return await this.locationModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
  }

  async deleteOne(id: string): Promise<any> {
    const destroyed: any = await this.locationModel.deleteOne({ _id: id });
    destroyed.id = id;
    return destroyed;
  }
}
