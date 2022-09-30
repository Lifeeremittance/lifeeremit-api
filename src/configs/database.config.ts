import { registerAs } from '@nestjs/config';

export default registerAs('DATABASE', () => ({
  URI: process.env.MONGODB_URI,
}));
