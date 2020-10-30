import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { CreateUserDto, UpdateUserDto, LoginUserDto, UserDto } from './dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof CreateUserDto>
  ) { }
  
  async findEmail(email: string): Promise<UserDto> {
    return this.userModel.findOne({email: email}).exec();
  }

  async findOne(id: string): Promise<UserDto> {
    return this.userModel.findOne({id}).exec();
  }

  async findAll(): Promise<UserDto[] | null> {
    return this.userModel.find().exec();
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
    const toUpdate = await this.userModel.findOne({id});

    const updated = Object.assign(toUpdate, dto);
    return await updated.save();
  }

}