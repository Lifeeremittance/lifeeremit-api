import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProvidersService } from "./providers.service";
import { ProvidersController } from "./providers.controller";
import { Providers, Providerschema } from "./schemas/provider.schema";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Providers.name, schema: Providerschema }]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
