import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChargesService } from "./charges.service";
import { ChargesController } from "./charges.controller";
import { Charges, ChargesSchema } from "./schemas/charge.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Charges.name, schema: ChargesSchema },
    ]),
  ],
  controllers: [ChargesController],
  providers: [ChargesService],
  exports: [ChargesService],
})
export class ChargesModule {}
