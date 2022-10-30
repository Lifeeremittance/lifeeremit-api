import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateChargeDto {
  @IsNotEmpty()
  @IsString()
  readonly serviceCharge: string;

  @IsNotEmpty()
  @IsString()
  readonly productInterest: string;

  @IsNotEmpty()
  @IsString()
  readonly dollarRate: string;
}
