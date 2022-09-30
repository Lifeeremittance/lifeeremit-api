import { registerAs } from '@nestjs/config';

export default registerAs('NODE', () => ({
  PORT: parseInt(process.env.PORT || '3000', 10),
}));
