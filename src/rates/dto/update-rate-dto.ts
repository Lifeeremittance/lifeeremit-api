import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateRateDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly provider: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly currency: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly value: string;
}
