import { Module } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";
import { WebhooksController } from "./webhooks.controller";
import { OrdersModule } from "../orders/orders.module";
import { ZohoModule } from "../zoho/zoho.module";
import { UsersModule } from "../users/users.module";
import { ProductsModule } from "../products/products.module";
@Module({
  imports: [OrdersModule, ZohoModule, UsersModule, ProductsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
