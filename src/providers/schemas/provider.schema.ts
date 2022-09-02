import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SCHEMA_DEFAULTS } from "../../const";

const { IS_REQUIRED, IS_UNIQUE, IS_NUMBER, NOW, IS_STRING } = SCHEMA_DEFAULTS;

export type ProviderDocument = Providers & Document;

@Schema()
export class Providers {
  @Prop({ ...IS_REQUIRED, ...IS_UNIQUE, ...IS_STRING })
  name: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  logo: string;

  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: ProviderDocument;
  _id?: string;
}

export const Providerschema = SchemaFactory.createForClass(Providers);
