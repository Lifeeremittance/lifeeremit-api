import { IsString, Length, IsOptional, IsBoolean } from "class-validator";

export class UpdatCurrencyDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  readonly currencyName: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  readonly currencyCode: string;

  @IsOptional()
  @IsString()
  readonly currencyImage: string;

  @IsOptional()
  @IsBoolean()
  readonly is_active: boolean;
}
