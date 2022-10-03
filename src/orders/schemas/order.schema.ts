import mongoose, { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../users/schemas/user.schema";
import { Providers } from "../../providers/schemas/provider.schema";
import { Products } from "../../products/schemas/products.schema";
import { Countries } from "../../countries/schemas/country.schema";
import { ORDER_STATUS, SCHEMA_DEFAULTS } from "../../const";

const { IS_NUMBER, IS_REQUIRED, IS_STRING, IS_UNIQUE, NEW_ORDER, NOW } =
  SCHEMA_DEFAULTS;

type OrderStatus = {
  type: ORDER_STATUS;
  created_at: Date;
};

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: User;

  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: Providers.name,
    autopopulate: true,
  })
  provider: Providers;

  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: Products.name,
    autopopulate: true,
  })
  product: Products;

  @Prop({
    ...IS_REQUIRED,
    type: mongoose.Schema.Types.ObjectId,
    ref: Countries.name,
    autopopulate: true,
  })
  country: Countries;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  phone_number: string;

  @Prop({ ...IS_STRING })
  email_address: string;

  @Prop({ ...IS_REQUIRED, ...NEW_ORDER })
  status: OrderStatus[];

  @Prop({ ...IS_STRING })
  company_address: string;

  @Prop({ ...IS_REQUIRED, ...IS_STRING })
  company_name: string;

  @Prop({ ...IS_STRING })
  contact_name: string;

  @Prop({ ...IS_STRING })
  reason: string;

  @Prop({ ...IS_STRING })
  reference_number: string;

  @Prop({ ...IS_NUMBER })
  invoice_number: number;

  @Prop({ ...IS_STRING })
  invoice: string;

  @Prop({ ...IS_STRING })
  currency: string;

  @Prop({ ...IS_STRING })
  rate: string;

  @Prop({ ...IS_NUMBER })
  amount: number;

  @Prop({ ...IS_NUMBER })
  product_value: number;

  @Prop({ ...IS_STRING })
  temp_key: string;

  @Prop({ ...IS_STRING })
  license_key: string;
  
  @Prop({ ...IS_NUMBER, ...NOW })
  created_at: Date;

  @Prop({ ...IS_NUMBER, ...NOW })
  updated_at: Date;

  // To make Typescript happy; we add the below properties to the schema
  _doc?: OrderDocument;
  _id?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
