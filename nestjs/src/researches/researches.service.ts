import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Research } from './researches.model';
import { CreateResearchDto, UpdateResearchDto } from './dto';

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
      .populate('sessions')
      .exec();
  }

  async create(dto: CreateResearchDto): Promise<Research> {
    console.log(dto.location);
    const research = await new this.researches(dto).save();

    return await research
      .populate('made_by')
      .populate('location')
      .populate('sessions')
      .execPopulate();
  }

  async findOne(id: string): Promise<Research> | null {
    return await this.researches
      .findById(id)
      .populate('made_by')
      .populate('location')
      .populate('sessions')
      .exec();
  }

  async update(id: string, dto: UpdateResearchDto): Promise<Research> {
    dto.updated_at = new Date();

    return await this.researches
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .populate('made_by')
      .populate('location')
<<<<<<< HEAD
      .populate('sessions').exec()
<<<<<<< HEAD
=======
  }

>>>>>>> origin/master
=======
      .populate('sessions')
      .exec()
>>>>>>> origin/master
  }

  async deleteOne(id: string): Promise<void> {
    await this.researches.findByIdAndDelete(id);
  }
}
