import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../@entities/user';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public createToken(userInfo: JwtPayload) {
    return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: 3600 });
  }

  public async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findOneByIdentifier(payload.username);
  }
}
