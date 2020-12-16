import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { CreateLocationDto, UpdateLocationDto } from './dto';

import { Location } from "./locations.model";

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location) private readonly locations: ReturnModelType<typeof Location>
  ) { }

  async findOne(id: string): Promise<Location> | null {
    return await this.locations.findById(id).populate('made_by').exec();
  }

  async findAll(): Promise<Location[] | null> {
    return await this.locations.find().populate('made_by').exec();
  }

  async create(dto: CreateLocationDto): Promise<Location> {
    const location = await new this.locations(dto).save();
    return await location.populate('made_by').execPopulate();
  }

  async update(id: string, dto: UpdateLocationDto): Promise<Location> {
    dto.updated_at = new Date();
    return await this.locations.findByIdAndUpdate(id, { $set: dto }, { new: true }).populate('made_by');
  }

  async deleteOne(id: string): Promise<void> {
    await this.locations.findByIdAndDelete(id);
  }
}
