import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto';

import { Roles } from '../common/interfaces/roles.interface';
import { validate } from "class-validator";

@Injectable()
export class UsersSeed {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Command({ command: 'create:user <firstname> <lastname>', describe: 'creates a user', autoExit: true })
  async create(
    @Positional({
      name: 'firstname',
      describe: 'the firstname',
      type: 'string'
    })
    firstname: string,
    @Positional({
      name: 'lastname',
      describe: 'the lastname',
      type: 'string'
    })
    lastname: string,
    @Option({
      name: 'email',
      describe: 'the email',
      type: 'string',
      alias: 'e',
      required: true
    })
    email: string,
    @Option({
      name: 'password',
      describe: 'the password',
      type: 'string',
      alias: 'p',
      required: true
    })
    password: string,
    @Option({
      name: 'role',
      describe: 'user role',
      alias: 'r',
      type: 'string',
      default: 'guest',
      required: false
    })
    role: string
  ) {

    if (!Object.values(Roles).includes(Roles[role])) {
      console.log("Role has to be either admin, researcher or guest, currently is:", role);
      return;
    }
    const user = new CreateUserDto();
    user.fullname = firstname + " " + lastname
    user.email = email
    user.password = password
    user.role = Roles[role]
    user.created_at = new Date()
    user.updated_at = null

    await validate(user).then(async (errors) => { // errors is an array of validation errors
      if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
        return;
      } else {
        const createdUser = await this.usersService.create(user);
        console.log("Created user: ", createdUser.fullname);
      }
    });

  }
}