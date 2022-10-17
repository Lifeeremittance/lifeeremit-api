import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateProviderDto {
  @IsString()
  @Length(2, 30)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly logo: string;
}
