import { Injectable } from "@nestjs/common";
import { HandleWebhookDto } from "./dto/handle-webhook.dto";

@Injectable()
export class WebhooksService {
  async verifyPaystack(
    handleWebhookDto: HandleWebhookDto,
    headers: { "x-paystack-signature": string }
  ) {
    const crypto = await import("node:crypto");

    const hash = crypto
      .createHmac("sha512", process.env.WEBHOOK_SIGNING_SECRET || "")
      .update(JSON.stringify(handleWebhookDto))
      .digest("hex");

    return hash === headers["x-paystack-signature"];
  }

  async verifyFlutterwave(headers: { "verif-hash": string }) {
    const secretHash = process.env.WEBHOOK_SIGNING_SECRET || "";
    const signature = headers["verif-hash"];

    return signature && signature === secretHash;
  }

  async extractPaymentData(handleWebhookDto: HandleWebhookDto) {
    const {
      event,
      data: {
        amount,
        metadata: { orderId, product_value, rate, currency },
        status,
      },
    } = handleWebhookDto;

    return {
      event,
      amount,
      orderId,
      product_value,
      rate,
      status,
      currency,
    };
  }
}
