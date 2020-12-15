import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Research } from './researches.model';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';

@Injectable()
export class ResearchesService {
  constructor(
    @InjectModel(Research)
    private readonly researches: ReturnModelType<typeof Research>,
  ) {}

  async findAll(): Promise<Research[] | null> {
    return await this.researches
      .find()
      .populate('made_by')
      .populate('location')
      .exec();
  }

  async create(dto: CreateResearchDto): Promise<Research> {
    const research = await new this.researches(dto).save();

    return await research
      .populate('made_by')
      .populate('location')
      .execPopulate();
  }

  async findOne(id: string): Promise<Research> | null {
    return await this.researches
      .findById(id)
      .populate('made_by')
      .populate('location')
      .exec();
  }

  async update(id: string, dto: UpdateResearchDto): Promise<Research> {
    return await this.researches.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );
  }

  async deleteOne(id: string) {
    await this.researches.findByIdAndDelete(id);
  }
}
