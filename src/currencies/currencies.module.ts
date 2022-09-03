import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CurrenciesService } from "./currencies.service";
import { CurrenciesController } from "./currencies.controller";
import { Currencies, CurrenciesSchema } from "./schemas/currency.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currencies.name, schema: CurrenciesSchema },
    ]),
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
