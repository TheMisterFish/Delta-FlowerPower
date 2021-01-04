import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { File } from '../common/models/file/file.model';
// import * as fs from 'fs';

@Injectable()
export class FieldappService {
  constructor(
    @InjectModel(File)
    private readonly file: any,
  ) {}

  async findOne(id: string): Promise<any> | null {
    return await this.file
      .findById(id)
      .populate('weights')
      .exec();
  }

  async findAll(): Promise<any[] | null> {
    const response = await this.file
      .find()
      .populate('weights')
      .exec();
    console.log(response);
    return response;
  }
}

