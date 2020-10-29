import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { UsersService } from './users.service';

@Injectable()
export class UsersSeed {
constructor(
    private readonly usersService: UsersService,
) { }

@Command({ command: 'create:user', describe: 'create a user', autoExit: true })
async create() {
    enum Roles {
      admin = 'admin',
      moderator = 'moderator',
      guest = 'guest'
    };

    const user = await this.usersService.create({
        fullname: 'Vincent V.',
        email: 'v.venhuizen@fontys.nl',
        password: 'test12',
        role: Roles[0],
        created_at: null,
        updated_at: null,
    });
    console.log(user);
}
}