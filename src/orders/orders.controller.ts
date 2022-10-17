import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnprocessableEntityException,
  ForbiddenException,
} from "@nestjs/common";
import { isUndefined, last, omitBy } from "lodash";
import {
  EMAILS,
  ENVIRONMENT,
  MESSAGES,
  ROLE,
  STATUS,
  ORDER_STATUS,
} from "../const";
import { Roles } from "../decorators/roles.decorator";
import { User } from "../users/schemas/user.schema";
import { whoAmI } from "../utils/who-am-I";
import { generateOrderNumber } from "../utils/generate-order-number";

import { MailService } from "../mail/mail.service";
import { UsersService } from "../users/users.service";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./schemas/order.schema";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService
  ) {}
  @Post()
  async create(
    @Request() req: { [key: string]: any },
    @Body() createOrderDto: CreateOrderDto
  ) {
    const { _id } = req.user;

    const user = await this.usersService.findOne({ _id });
    if (!user) throw new UnprocessableEntityException(MESSAGES.USER_NOT_FOUND);

    const order_number = generateOrderNumber();
    
    const createdOrder: Order = await this.ordersService.create({
      ...createOrderDto,
      user: _id,
      order_number,
    });

    return {
      status: STATUS.SUCCESS,
      data: createdOrder,
    };
  }

  @Get()
  async findAll(@Request() req: { [key: string]: any }) {
    // const requester = req.user?._id ?? "";

    const { isUser } = whoAmI(req.user.roles);

    const query = {
      ...(isUser && { user: req.user._id }),
      ...req.query,
    };

    console.log(query);

    let orders = await this.ordersService.findAll(query);

    return {
      status: STATUS.SUCCESS,
      data: orders,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: any, @Request() req: { user: User }) {
    const order = await this.ordersService.findOne({ _id: id });

    return {
      status: STATUS.SUCCESS,
      data: order,
    };
  }

  @Roles(ROLE.ADMIN)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: { user: User }
  ) {
    let prunedUpdateOrderDto = omitBy(updateOrderDto, isUndefined);
    const prunedUpdateOrderDtoArray = Object.keys(prunedUpdateOrderDto);

    const isUpdatingStatus = prunedUpdateOrderDtoArray.includes("status");

    if (isUpdatingStatus) {
      prunedUpdateOrderDto = {
        ...prunedUpdateOrderDto,
        $push: {
          status: {
            $each: [prunedUpdateOrderDto.status],
          },
        },
      };

      delete prunedUpdateOrderDto.status;
    }

    const updatedOrder = await this.ordersService.update(
      { _id: id },
      prunedUpdateOrderDto
    );

    return {
      status: updatedOrder ? STATUS.SUCCESS : STATUS.ERROR,
      data: updatedOrder ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
    };
  }

  @Roles(ROLE.ADMIN)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const deletedOrder = await this.ordersService.remove(id);

    return {
      status: deletedOrder ? STATUS.SUCCESS : STATUS.ERROR,
    };
  }
}
