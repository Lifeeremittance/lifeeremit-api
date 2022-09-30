import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { DECORATOR_KEYS } from '../../const';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      DECORATOR_KEYS.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    return isPublic ? true : super.canActivate(context);
  }
}
