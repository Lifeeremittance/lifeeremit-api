import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import * as sgMail from "@sendgrid/mail";
import { UsersService } from "./../users/users.service";
import { User, UserDocument } from "./../users/schemas/user.schema";
import { generateToken } from "./../utils/generate-token";
import { MailService } from "./../mail/mail.service";
import { sendNotification, EMAIL_TEMPLATES } from "./../utils/email-send";
import { CACHE_KEYS, EMAILS, LOGIN_ENTITIES, ROLE } from "./../const";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async requestLoginToken(
    email_address: string,
    entity: LOGIN_ENTITIES
  ): Promise<boolean> {
    let user: User;

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

    const token = generateToken();
    // save token in user schema
    await this.usersService.update(user._id, { token });

    // const emailBody = {
    //   from: '"Lifeeremit" <lifeeremit@gmail.com>',
    //   to: email_address,
    //   subject: "LIFEEREMIT email verification",
    //   html: token,
    // };

    // sgMail.setApiKey(process.env.MAIL_PASSWORD);

    // await sgMail.send(emailBody);

    await sendNotification({
      recipient: email_address,
      templateId: EMAIL_TEMPLATES.LOGIN,
      substitutions: {
        name: user.fullName,
        token,
      },
    });

    // await this.mailService.sendMail(
    //   email_address,
    //   EMAILS.CONFIRMATION.SUBJECT,
    //   'confirmation',
    //   { username: user.fullName, token }
    // );

    return true;
  }

  async validateUser(
    email_address: string,
    token: string,
    entity: LOGIN_ENTITIES
  ): Promise<UserDocument | undefined | null> {
    const user = await this.usersService.findOne({ email_address });

    if (!user) return null;

    if (user.token !== token) return null;

    // check if entity is admin and user is not admin
    if (entity === LOGIN_ENTITIES.ADMIN && !user.roles.includes(ROLE.ADMIN))
      return null;

    await this.usersService.update(user._id, { token: "" });

    return user?._doc;
  }

  async login(user: any) {
    const payload = {
      sub: user._id,
      email_address: user.email_address,
      roles: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async sendNewsletter(email_address: string): Promise<boolean> {
    const emailBody = {
      from: '"LIFEEREMIT" <lifeeremit@gmail.com>',
      to: "info@lifeeremit.com",
      subject: "LIFEEREMIT newsletter submit",
      html: `${email_address} just signed up to the lifeeremit newsletter`,
    };

    sgMail.setApiKey(process.env.MAIL_PASSWORD);

    sgMail.send(emailBody);

    return true;
  }
}
