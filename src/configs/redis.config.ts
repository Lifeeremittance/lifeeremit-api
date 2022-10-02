import { registerAs } from '@nestjs/config';

export default registerAs('REDIS', () => ({
  URL: process.env.REDIS_URL,
}));
