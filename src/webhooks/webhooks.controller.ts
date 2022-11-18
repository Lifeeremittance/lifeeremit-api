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
import { HandleWebhookDto } from "./dto/handle-webhook.dto";
import { CHARGE_STATUS, MESSAGES, ORDER_STATUS, STATUS } from "../const";

@Public()
@Controller("webhooks")
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly ordersService: OrdersService
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
