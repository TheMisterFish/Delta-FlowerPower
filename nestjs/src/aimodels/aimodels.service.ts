import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AimodelDto, CreateAimodelDto } from './dto';
import { Aimodel } from './aimodels.model';
import { UpdateAimodelDto } from './dto/update-aimodel.dto';
@Injectable()
export class AimodelsService {
  constructor(
    @InjectModel(Aimodel)
    private readonly aimodelModel: ReturnModelType<typeof AimodelDto>,
  ) {}

  async findOne(id: string): Promise<AimodelDto> | null {
    return await this.aimodelModel.findById(id).exec();
  }

  async findAll(): Promise<AimodelDto[] | null> {
    return await this.aimodelModel.find().exec();
  }

  async create(dto: CreateAimodelDto): Promise<AimodelDto> {
    const createdAimodel = new this.aimodelModel(dto);
    return await createdAimodel.save();
  }

  async update(
    id: string,
    dto: UpdateAimodelDto,
    remove: boolean,
  ): Promise<AimodelDto> {
    dto.updated_at = new Date();
    if (dto.weights) {
      if (remove) {
        const aimodel = await this.aimodelModel.findById(id);

        aimodel.weights = aimodel.weights.filter(
          w => w.filePath !== dto.weights[0].filePath,
        );

        return await this.aimodelModel.findByIdAndUpdate(
          id,
          { $set: aimodel },
          { new: true },
        );
      } else {
        return await this.aimodelModel.findByIdAndUpdate(
          id,
          {
            $push: { weights: dto.weights[0] },
          },
          { new: true },
        );
      }
    } else {
      return await this.aimodelModel.findByIdAndUpdate(
        id,
        { $set: dto },
        { new: true },
      );
    }
  }

  async deleteOne(id: string): Promise<any> {
    const destroyed: any = await this.aimodelModel.deleteOne({ _id: id });
    destroyed.id = id;
    return destroyed;
  }
}
