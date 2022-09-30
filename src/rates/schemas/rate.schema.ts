import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Providers } from "../../providers/schemas/provider.schema";
import { Countries } from "../../countries/schemas/country.schema";
import { Currencies } from "../../currencies/schemas/currency.schema";
import { SCHEMA_DEFAULTS } from "../../const";

const { IS_REQUIRED, IS_UNIQUE, IS_STRING, NOW, IS_NUMBER } = SCHEMA_DEFAULTS;

export type RateDocument = Rates & Document;

@Schema()
export class Rates {
  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: Providers.name,
    autopopulate: true,
  })
  provider: string;

  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: Countries.name,
    autopopulate: true,
  })
  country: string;

  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: Currencies.name,
    autopopulate: true,
  })
  currency: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  value: string;

  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: RateDocument;
  _id?: string;
}

export const RatesSchema = SchemaFactory.createForClass(Rates);
