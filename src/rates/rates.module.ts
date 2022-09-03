import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RatesService } from "./rates.service";
import { RatesController } from "./rates.controller";
import { Rates, RatesSchema } from "./schemas/rate.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rates.name, schema: RatesSchema },
    ]),
  ],
  controllers: [RatesController],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
