import { IsString, Length, IsOptional, IsBoolean } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  readonly is_active: boolean;
}
