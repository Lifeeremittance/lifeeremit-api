import { ORDER_STATUS } from "../../const";
import { PartialType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  validate,
} from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(ORDER_STATUS))
  readonly status: ORDER_STATUS;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly currency: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly rate: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly product_value: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly temp_key: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly license_key: string;
}

validate(UpdateOrderDto, { skipMissingProperties: true });
