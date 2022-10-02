import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class HandleWebhookDto {
  @IsNotEmpty()
  @IsString()
  readonly event: string;

  @IsNotEmpty()
  @IsObject()
  readonly data: {
    amount: number;
    metadata: {
      orderId: string;
    };
    status: string;
  };
}
