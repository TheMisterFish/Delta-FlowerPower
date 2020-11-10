
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../users/dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  
  async validateUser(email: string, pass: string): Promise<UserDto> {
    const user = await this.usersService.findEmailLogin(email);

    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(pass, user.password);
    if (valid) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: any) {  
    const payload = { name: user.fullname, role: user.role, email: user.email, _id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}