import {
  Controller,
  Post,
  Body,
  Request,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Public } from "../decorators/is-public.decorator";
import { OrdersService } from "../orders/orders.service";
import { WebhooksService } from "./webhooks.service";
import { ZohoService } from "../zoho/zoho.service";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { HandleWebhookDto } from "./dto/handle-webhook.dto";
import { sendNotification, EMAIL_TEMPLATES } from "./../utils/email-send";
import { CHARGE_STATUS, MESSAGES, ORDER_STATUS, STATUS } from "../const";

@Public()
@Controller("webhooks")
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly ordersService: OrdersService,
    private readonly zohoService: ZohoService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService
  ) {}

  @Post("/paystack")
  async paystack(
    @Body() handleWebhookDto: HandleWebhookDto,
    @Request() req: { [key: string]: any }
  ) {
    // const isTrusted = await this.webhooksService.verifyPaystack(
    //   handleWebhookDto,
    //   req.headers,
    // );

    // if (!isTrusted) throw new UnauthorizedException();

    const {
      event,
      status,
      amount,
      orderId,
      product_value,
      rate,
      currency,
      service_charge,
      product_interest,
      dollar_rate,
    } = await this.webhooksService.extractPaymentData(handleWebhookDto);

    if (event !== CHARGE_STATUS.PAYSTACK_SUCCESS || status !== "success")
      throw new UnprocessableEntityException();

    const order = await this.ordersService.findOne({
      _id: orderId,
    });

    if (!order) throw new UnprocessableEntityException();

    const product = await this.productsService.findOne({
      _id: order.product,
    });

    const user = await this.usersService.findOne({
      _id: order.user,
    });

    const { access_token } = await this.zohoService.getAccessToken();

    const res = await this.zohoService.createInvoice(access_token, {
      customer_id: user.contact_id,
      date: new Date().toISOString().split("T")[0],
      line_items: [
        {
          item_id: product.item_id,
          quantity: 1,
          rate: product_value,
        },
      ],
      custom_fields: [
        {
          label: "Transaction No",
          value: order.order_number.replace(/-/g, ""),
        },
        {
          label: "Temp Key",
          value: order.temp_key,
        },
        {
          label: "License Key",
          value: order.license_key,
        },
        {
          label: "Exchange Rate",
          value: rate,
        },
        {
          label: "Interest Charge",
          value: product_interest,
        },
        {
          label: "Service Charge",
          value: service_charge,
        },
        {
          label: "Reference No",
          value: order.reference_number,
        },
        {
          label: "Provider",
          value: order.provider.name,
        },
      ],
    });

    const {
      invoice: { invoice_id, invoice_url },
    } = res;

    await this.zohoService.setInvoiceStatus(access_token, { invoice_id });

    await sendNotification({
      recipient: user.email_address,
      templateId: EMAIL_TEMPLATES.PAYMENT_DETAILS,
      substitutions: {
        name: user.fullName,
        transaction_no: order.order_number,
        company_name: order.company_name || user.companyName,
        company_address: order.company_address || user.address,
        product: order.product.name,
        provider: order.provider.name,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        status: "Success",
        amount,
        rate,
        amount_paid: product_value,
        reference_no: order.reference_number,
        invoice_no: order.invoice_number,
        reason: order.reason,
      },
    });

    await sendNotification({
      recipient: user.email_address,
      templateId: EMAIL_TEMPLATES.CUSTOMER_RECEIPT,
      substitutions: {
        name: user.fullName,
        transaction_no: order.order_number,
        product: order.product.name,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        amount,
        rate,
        product_value: product_value,
        reason: order.reason,
        temp_key: order.temp_key || "N/A",
        license_key: order.license_key || "N/A",
        charge: service_charge,
        interest: product_interest,
      },
    });

    const updatedOrder = await this.ordersService.update(
      { _id: orderId },
      {
        $push: {
          status: {
            $each: [ORDER_STATUS.PAYMENT_SUCCESSFUL],
          },
        },
        amount,
        product_value,
        rate,
        currency,
        service_charge,
        product_interest,
        dollar_rate,
        zoho_invoice: invoice_url,
      }
    );

    return {
      status: updatedOrder ? STATUS.SUCCESS : STATUS.ERROR,
      data: updatedOrder ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
    };
  }

  // @Post('/flutterwave')
  // async flutterwave(
  //   @Body() handleWebhookDto: HandleWebhookDto,
  //   @Request() req: { [key: string]: any },
  // ) {
  //   const isTrusted = await this.webhooksService.verifyFlutterwave(req.headers);

  //   if (!isTrusted) throw new UnauthorizedException();

  //   const { event, status, amount, order_number, test_type } =
  //     await this.webhooksService.extractPaymentData(handleWebhookDto);

  //   if (event !== CHARGE_STATUS.FLUTTERWAVE_SUCCESS || status !== 'successful')
  //     throw new UnprocessableEntityException();

  //   const testType = await this.testTypesService.findOne({
  //     _id: test_type,
  //   });

  //   if (testType && amount * 100 < testType.price)
  //     throw new UnprocessableEntityException();

  //   const updatedOrder = await this.ordersService.update(
  //     { order_number },
  //     {
  //       $push: {
  //         status: {
  //           $each: [ORDER_STATUS.PAYMENT_SUCCESSFUL],
  //         },
  //       },
  //     },
  //   );

  //   return {
  //     status: updatedOrder ? STATUS.SUCCESS : STATUS.ERROR,
  //     data: updatedOrder ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
  //   };
  // }
}
