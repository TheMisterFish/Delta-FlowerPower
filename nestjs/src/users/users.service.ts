import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto, UserDto, UpdatePassword } from './dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof UserDto>
  ) { }

  async findEmailLogin(email: string): Promise<UserDto> {
    return await this.userModel.findOne({ email: email }).select('+password').exec();
  }

  async findOne(id: string): Promise<UserDto> | null {
    return await this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[] | null> {
    return await this.userModel.find().exec();
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    const createdUser = new this.userModel(dto);
    const user = await createdUser.save();
    user.password = undefined;
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
    dto.updated_at = new Date();
    return await this.userModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
  }

  async deleteOne(id: string): Promise<any> {
    const destroyed: any = await this.userModel.deleteOne({ _id: id });
    destroyed.id = id;
    return destroyed;
  }

  async changePassword(user: any, update: UpdatePassword){
    await this.userModel.findById(user.id).select('+password').exec(async function(err, doc) {
      if (err) return err;
      const valid = await bcrypt.compare(update.password, doc.password);
      if(valid){
        doc.password = update.new_password;
        doc.save();
      } else {
        throw new BadRequestException("Bad Password");
      }
    });
    return "Updated Password.";

  }

}