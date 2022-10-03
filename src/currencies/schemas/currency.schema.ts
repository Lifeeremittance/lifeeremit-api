import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SCHEMA_DEFAULTS } from "../../const";

const { IS_REQUIRED, IS_NUMBER, NOW, IS_STRING } = SCHEMA_DEFAULTS;

export type CurrencyDocument = Currencies & Document;

@Schema()
export class Currencies {
  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  currencyName: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  currencyCode: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  currencyImage: string;

  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: CurrencyDocument;
  _id?: string;
}

export const CurrenciesSchema = SchemaFactory.createForClass(Currencies);
