import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { CreateSessionDto, UpdateSessionDto, SessionsDto } from './dto';
import { Session } from "./sessions.model";
@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session) private readonly sessionModel: ReturnModelType<typeof SessionsDto>
  ) { }

  async findOne(id: string): Promise<SessionsDto> | null {
    return await this.sessionModel.findById(id).exec();
  }

  async findAll(): Promise<Session[] | null> {
    return await this.sessionModel.find().exec();
  }

  async create(dto: CreateSessionDto): Promise<SessionsDto> {
    const createdUser = new this.sessionModel(dto);
    return await createdUser.save();
  }

  async update(id: string, dto: UpdateSessionDto): Promise<SessionsDto> {
    dto.updated_at = new Date();
    return await this.sessionModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
  }

  async deleteOne(id: string): Promise<any> {
    const destroyed: any = await this.sessionModel.deleteOne({ _id: id });
    destroyed.id = id;
    return destroyed;
  }
}
