import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCurrencyDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  readonly currencyName: string;

  @IsNotEmpty()
  @IsString()
  readonly currencyCode: string;
}
