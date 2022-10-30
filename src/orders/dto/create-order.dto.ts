import {
  IsEmail,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
export class CreateOrderDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly user: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly provider: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly product: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  readonly country: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly order_number: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  readonly company_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly company_address: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  readonly contact_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(11)
  readonly phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  readonly email_address: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly reason: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  readonly invoice_number: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly reference_number: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly invoice: string;
}
