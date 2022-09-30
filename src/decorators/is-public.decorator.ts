import { SetMetadata } from '@nestjs/common';
import { DECORATOR_KEYS } from '../const';

export const Public = () => SetMetadata(DECORATOR_KEYS.IS_PUBLIC_KEY, true);
