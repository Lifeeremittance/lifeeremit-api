import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Products, Productschema } from "./schemas/products.schema";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Products.name, schema: Productschema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
