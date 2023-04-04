import {
  IsNotEmpty,
  IsString,
  Length,
  IsMongoId,
  IsOptional,
  IsEmail,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @Length(2, 30)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly provider: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(3, 30)
  @IsOptional()
  readonly item_id: string;
}
