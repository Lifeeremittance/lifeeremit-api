import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ROLE, SCHEMA_DEFAULTS } from "../../const";

const { IS_REQUIRED, IS_NUMBER, NOW, IS_USER, IS_STRING } = SCHEMA_DEFAULTS;

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  email_address: string;

  // @Prop({ ...IS_REQUIRED, enum: [GENDERS.MALE, GENDERS.FEMALE], ...IS_STRING })
  // gender: string;

  @Prop({ ...IS_STRING })
  fullName: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  phone_number: string;

  @Prop(IS_USER)
  roles: ROLE[];

  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  companyName: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  contact_id: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  address: string;

  @Prop({ ...IS_STRING })
  country: string;

  @Prop({ ...IS_STRING })
  token: string;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: UserDocument;
  _id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
