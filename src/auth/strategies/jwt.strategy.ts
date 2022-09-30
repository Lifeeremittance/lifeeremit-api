import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ROLE } from '../../const';

type Payload = {
  sub: string;
  fullName: string;
  email_address: string;
  roles: ROLE[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: Payload) {
    return {
      _id: payload.sub,
      fullName: payload.fullName,
      email_address: payload.email_address,
      roles: payload.roles,
    };
  }
}
