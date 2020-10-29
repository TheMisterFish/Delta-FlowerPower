import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto';

import { Roles } from '../interfaces/roles.interface';
import { validate } from "class-validator";

@Injectable()
export class UsersSeed {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Command({ command: 'create:user', describe: 'create a user', autoExit: true })
  async create() {
    
    const user = new CreateUserDto();
    user.fullname = 'TEST12'
    user.email = 'v.test@te.st'
    user.password = 'xx123123s'
    user.role = Roles.admin
    user.created_at = null
    user.updated_at = null

    await validate(user).then(async (errors) => { // errors is an array of validation errors
      if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
        return;
      }
    });
    const createdUser = await this.usersService.create(user);
    console.log(createdUser);
  }
}