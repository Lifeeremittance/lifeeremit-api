import { IsEmail,  IsNotEmpty } from 'class-validator';

export class SendNewsletterDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email_address: string;
}
