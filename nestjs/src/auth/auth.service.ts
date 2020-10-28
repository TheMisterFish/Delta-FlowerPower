
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  
  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(pass, user.password);
    if (valid) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}