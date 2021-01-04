import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { File } from '../common/models/file/file.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FieldappService {
  constructor(
    @InjectModel(File)
    private readonly file: ReturnModelType<typeof File>,
  ) {}

  async findAll(): Promise<File[] | null> {
    const data = [];
    const fsPromises = fs.promises;
    const files = await fsPromises.readdir("public/files/builds");
    for (const file of files) {
        const newFile = new File;
        newFile.fileName = file;
        newFile.fileSize = fs.statSync(path.join("public/files/builds", file)).size
        newFile.filePath = path.join("files/builds", file);
        data.push(newFile);
    }
    return data;
  }
}

