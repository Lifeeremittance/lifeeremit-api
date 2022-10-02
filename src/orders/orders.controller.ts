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
  NOTIFICATION_MESSAGES,
  ORDER_STATUS,
} from "../const";
import { Roles } from "../decorators/roles.decorator";
import { User } from "../users/schemas/user.schema";
import { whoAmI } from "src/utils/who-am-I";

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

    const email_address =
      createOrderDto.email_address || (user && user.email_address);

    const createdOrder: Order = await this.ordersService.create({
      ...createOrderDto,
      user: _id,
    });

    return {
      status: STATUS.SUCCESS,
      data: createdOrder,
    };
  }

  @Get()
  async findAll(@Request() req: { [key: string]: any }) {
    // const requester = req.user?._id ?? "";

    const query = {
      ...req.query,
    };

    let orders = await this.ordersService.findAll(query);

    return {
      status: STATUS.SUCCESS,
      data: orders,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: any, @Request() req: { user: User }) {
    const order = await this.ordersService.findOne({ _id: id });

    // const { isAdmin, isUser } = whoAmI(req.user.roles);

    return {
      status: STATUS.SUCCESS,
      data: order,
    };
  }

  @Roles(ROLE.ADMIN, ROLE.FIELD_OFFICER, ROLE.DIAGNOSTIC_CENTER)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: { user: User }
  ) {
    let prunedUpdateOrderDto = omitBy(updateOrderDto, isUndefined);
    const prunedUpdateOrderDtoArray = Object.keys(prunedUpdateOrderDto);

    const isUpdatingStatus = prunedUpdateOrderDtoArray.includes("status");
    const isCompleted = prunedUpdateOrderDto.status === ORDER_STATUS.COMPLETED;

    if (isUpdatingStatus) {
      prunedUpdateOrderDto = {
        ...prunedUpdateOrderDto,
        $push: {
          status: {
            type: prunedUpdateOrderDto.status,
            created_at: Date.now(),
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
