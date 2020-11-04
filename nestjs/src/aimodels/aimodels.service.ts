import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { AimodelDto, CreateAimodelDto} from './dto';
import { Aimodel } from "./aimodels.model";
@Injectable()
export class AimodelsService {
  constructor(
    @InjectModel(Aimodel) private readonly aimodelModel: ReturnModelType<typeof AimodelDto>
  ) { }

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

  async deleteOne(id: string): Promise<any> {
    const destroyed: any = await this.aimodelModel.deleteOne({ _id: id });
    destroyed.id = id;
    return destroyed;
  }
}
