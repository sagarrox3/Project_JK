import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/service/users.service';

@Injectable()
export class AuthService {
      constructor(
            private readonly usersService: UsersService,
            private readonly jwtService: JwtService,
      ) {}

      async validateUser(payload: any): Promise<any> {
            const {email, name, sub, picUrl} = payload;
            let user: any = await this.usersService.findByEmail(email);
            if(!user) {
                  user = await this.usersService.createUser(email, name, sub, picUrl);
            }
            if (user && user.googleId === sub) {
                  return user;
            }
            throw new UnauthorizedException('Invalid credentials');
      }

      async login(user: any) {
            const payload = { email: user.email, sub: user._id };
            return {
              access_token: this.jwtService.sign(payload),
              user: user,
            };
      }
}
