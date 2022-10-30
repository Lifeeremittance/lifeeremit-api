import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SCHEMA_DEFAULTS } from "../../const";

const { IS_REQUIRED, IS_NUMBER, NOW, IS_STRING } = SCHEMA_DEFAULTS;

export type ChargeDocument = Charges & Document;

@Schema()
export class Charges {
  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  serviceCharge: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  productInterest: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  dollarRate: string;

  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: ChargeDocument;
  _id?: string;
}

export const ChargesSchema = SchemaFactory.createForClass(Charges);
