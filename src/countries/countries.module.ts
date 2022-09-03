import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CountriesService } from "./countries.service";
import { CountriesController } from "./countries.controller";
import { Countries, CountriesSchema } from "./schemas/country.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Countries.name, schema: CountriesSchema },
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
