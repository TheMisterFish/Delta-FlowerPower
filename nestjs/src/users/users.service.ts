import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(CreateUserDto) private readonly userModel: ReturnModelType<typeof CreateUserDto>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDto[] | null> {
    return this.userModel.find().exec();
  }
  
  async findOne(username: string): Promise<UserDto> {
    return this.userModel.findOne({username}).exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
    const toUpdate = await this.userModel.findOne({id});

    const updated = Object.assign(toUpdate, dto);
    return await updated.save();
  }

}