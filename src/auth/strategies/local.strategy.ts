import { PassportStrategy } from '@nestjs/passport';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LOGIN_ENTITIES } from '../../const';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: 'email_address',
      passwordField: 'token',
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    // @ts-ignore
    const requester = request.body?.entity || LOGIN_ENTITIES.USER;

    const user = await authService.validateUser(username, password, requester);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
