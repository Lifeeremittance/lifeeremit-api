import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Providers } from "../../providers/schemas/provider.schema";
import { SCHEMA_DEFAULTS } from "../../const";

const { IS_REQUIRED, IS_UNIQUE, IS_NUMBER, NOW, IS_STRING } = SCHEMA_DEFAULTS;

export type ProductDocument = Products & Document;

@Schema()
export class Products {
  @Prop({ ...IS_REQUIRED, ...IS_UNIQUE, ...IS_STRING })
  name: string;

  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: Providers.name,
    autopopulate: true,
  })
  provider: string;

  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: ProductDocument;
  _id?: string;
}

export const Productschema = SchemaFactory.createForClass(Products);
