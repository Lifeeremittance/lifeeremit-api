import type { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule, MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";

import databaseConfig from "./configs/database.config";
import nodeConfig from "./configs/node.config";
import jwtConfig from "./configs/jwt.config";
import redisConfig from "./configs/redis.config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";

import { UsersModule } from "./users/users.module";
import { ProvidersModule } from "./providers/providers.module";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { CountriesModule } from "./countries/countries.module";
import { CurrenciesModule } from "./currencies/currencies.module";
import { RatesModule } from "./rates/rates.module";
import { MailModule } from "./mail/mail.module";
import { OrdersModule } from "./orders/orders.module";
import { WebhooksModule } from "./webhooks/webhooks.module";
import { ChargesModule } from "./charges/charges.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      // validate,
      load: [
        databaseConfig,
        nodeConfig,
        jwtConfig,
        redisConfig,
        // mailConfig,
        // paymentsConfig,
      ],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("DATABASE.URI"),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectionFactory: (connection: MongooseModuleFactoryOptions) => {
          connection.plugin(require("mongoose-autopopulate"));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        ttl: 60 * 60 * 24, // 1 day
        url: configService.get('REDIS.URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProvidersModule,
    AuthModule,
    ProductsModule,
    CountriesModule,
    CurrenciesModule,
    RatesModule,
    MailModule,
    OrdersModule,
    WebhooksModule,
    ChargesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
