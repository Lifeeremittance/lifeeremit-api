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

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly temp_key_exp_date: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly license_key_exp_date: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly service_charge: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly product_interest: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly dollar_rate: string;
}

validate(UpdateOrderDto, { skipMissingProperties: true });
