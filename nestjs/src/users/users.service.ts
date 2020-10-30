import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof UserDto>
  ) { }

  async findEmailLogin(email: string): Promise<UserDto> {
    return this.userModel.findOne({ email: email }).select('+password').exec();
  }

  async findOne(id: string): Promise<UserDto> | null {
    const user = await this.userModel.findById(id).exec();
    console.log(user);
    return null
  }

  async findAll(): Promise<User[] | null> {
    return this.userModel.find().exec();
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
    dto.updated_at = new Date();
    return await this.userModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
  }

  async deleteOne(id: string): Promise<any> {
    const destroyed: any = await this.userModel.deleteOne({ _id: id });
    console.log(destroyed);
    destroyed.id = id;
    return destroyed;
  }

}