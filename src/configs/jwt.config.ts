import { registerAs } from '@nestjs/config';

export default registerAs('JWT', () => ({
  SECRET: process.env.JWT_SECRET_KEY,
  EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
}));
