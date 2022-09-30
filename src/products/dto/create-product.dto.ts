import { IsNotEmpty, IsString, Length, IsMongoId } from "class-validator";

export class CreateProductDto {
  @IsString()
  @Length(2, 30)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly provider: string;
}
