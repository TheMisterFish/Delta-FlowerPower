import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AimodelDto, CreateAimodelDto } from './dto';
import { Aimodel } from './aimodels.model';
import { UpdateAimodelDto } from './dto/update-aimodel.dto';
import { CreateaAimodelWeightsDto } from './dto/create-aimodel-weights.dto';
import { File } from 'src/common/models/file/file.model';
import * as fs from 'fs';

@Injectable()
export class AimodelsService {
  constructor(
    @InjectModel(Aimodel)
    private readonly aimodelModel: ReturnModelType<typeof AimodelDto>,
    @InjectModel(File)
    private readonly file: ReturnModelType<typeof File>,
  ) {}

  async findOne(id: string): Promise<AimodelDto> | null {
    return await this.aimodelModel
      .findById(id)
      .populate('weights')
      .exec();
  }

  async findAll(): Promise<AimodelDto[] | null> {
    const response = await this.aimodelModel
      .find()
      .populate('weights')
      .exec();
    console.log(response);
    return response;
  }

  async create(dto: CreateAimodelDto): Promise<AimodelDto> {
    const createdAimodel = new this.aimodelModel(dto);
    console.log(createdAimodel);
    return await createdAimodel.save();
  }

  async update(id: string, dto: UpdateAimodelDto): Promise<AimodelDto> {
    return await this.aimodelModel.findByIdAndUpdate(id, {
      $set: dto,
      new: true,
    });
  }

  async deleteWeights(id: string, weightsid: string) {
    const aimodel = await this.aimodelModel.findById(id).populate('weights');
    const weights = await this.file.findById(weightsid);

    aimodel.weights = aimodel.weights.filter(
      w => (w as DocumentType<File>)._id.toString() !== weightsid,
    );

    fs.unlinkSync(weights.filePath);

    return await this.aimodelModel.findByIdAndUpdate(
      id,
      { $set: aimodel },
      { new: true },
    ).populate('weights');
  }

  async createWeights(
    id: string,
    createAimodelWeightsDto: CreateaAimodelWeightsDto,
  ): Promise<AimodelDto> {
    const weights = await new this.file(createAimodelWeightsDto.weights).save();

    const aimodel = await this.aimodelModel.findById(id).populate('weights');

    aimodel.weights.push(weights);

    return await this.aimodelModel
      .findByIdAndUpdate(id, { $set: aimodel }, { new: true })
      .populate('weights');
  }

  async deleteOne(id: string): Promise<any> {
    const destroyed: any = await this.aimodelModel.deleteOne({ _id: id });
    destroyed.id = id;
    return destroyed;
  }
}
