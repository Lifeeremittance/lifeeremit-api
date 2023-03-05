import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SCHEMA_DEFAULTS } from "../../const";

const { IS_REQUIRED, IS_BOOLEAN, IS_NUMBER, NOW, IS_STRING } = SCHEMA_DEFAULTS;

export type CountryDocument = Countries & Document;

@Schema()
export class Countries {
  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  countryName: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  countryFlag: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  countryCode: string;

  @Prop({ ...IS_REQUIRED, ...IS_BOOLEAN, default: true })
  is_active: boolean;

  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: CountryDocument;
  _id?: string;
}

export const CountriesSchema = SchemaFactory.createForClass(Countries);
