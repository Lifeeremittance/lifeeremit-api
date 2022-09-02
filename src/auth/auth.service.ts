import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { UserDocument } from './../users/schemas/user.schema';
// import { generateToken } from './../utils/generate-token';
// import { MailService } from './../mail/mail.service';
import {
  CACHE_KEYS,
  DUMMY_TOKEN,
  EMAILS,
  ENVIRONMENT,
  LOGIN_ENTITIES,
  ROLE,
} from './../const';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async requestLoginToken(
    email_address: string,
    entity: LOGIN_ENTITIES,
  ): Promise<boolean> {
    const isProduction = process.env.NODE_ENV === ENVIRONMENT.PRODUCTION;
    let user;

    switch (entity) {
      case LOGIN_ENTITIES.USER:
        user = await this.usersService.findOne({ email_address });
        break;
      case LOGIN_ENTITIES.ADMIN:
        user = await this.usersService.findOne({
          email_address,
          roles: { $in: [ROLE.ADMIN] },
        });
        break;
      default:
        return false;
    }

    if (!user) return false;

    // const token = isProduction ? generateToken() : DUMMY_TOKEN;
    // const token = DUMMY_TOKEN;

    // if (isProduction && value === 'OK') {
    //   await this.mailService.sendMail(
    //     email_address,
    //     EMAILS.CONFIRMATION.SUBJECT,
    //     EMAILS.CONFIRMATION.TEMPLATE_NAME,
    //     { username: user.username, token },
    //   );
    // }

    return true;
  }

  async validateUser(
    email_address: string,
    token: string,
    entity: LOGIN_ENTITIES,
  ): Promise<UserDocument | undefined | null> {
    const user = await this.usersService.findOne({ email_address });

    return user?._doc;
  }

  async login(user: any) {
    const payload = {
      sub: user._id,
      fullName: user.fullName,
      email_address: user.email_address,
      roles: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
