import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  
  async findOne(username: string): Promise<User> {
    return this.userModel.find(username).exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.userModel.findOne(id);
    delete toUpdate.password;
    delete toUpdate.favorites;

    const updated = Object.assign(toUpdate, dto);
    return await this.userModel.save(updated);
  }

}