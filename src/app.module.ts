import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule, MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { APP_GUARD } from '@nestjs/core';

import databaseConfig from "./configs/database.config";
import nodeConfig from "./configs/node.config";
import jwtConfig from './configs/jwt.config';

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

import { UsersModule } from "./users/users.module";
import { ProvidersModule } from "./providers/providers.module";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      // validate,
      load: [
        databaseConfig,
        nodeConfig,
        jwtConfig,
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
    UsersModule,
    ProvidersModule,
    AuthModule,
    ProductsModule,
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
