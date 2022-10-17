import { Model } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order, OrderDocument } from "./schemas/order.schema";
import { MESSAGES } from "../const";

type UpdateDTOType = { [key: string]: any } | UpdateOrderDto;

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(filter: { [key: string]: any } = {}): Promise<Order[]> {
    return this.orderModel.find(filter).sort({ _id: -1 }).exec();
  }

  async findOne(filter: { [key: string]: any }): Promise<Order> {
    const order = await this.orderModel.findOne(filter).exec();

    if (!order)
      throw new NotFoundException(
        MESSAGES.MISSING_RESOURCE.replace("{0}", "Order")
      );

    return order;
  }

  async update(
    filter: { [key: string]: string },
    updateOrderDto: UpdateDTOType
  ): Promise<Order | null> {
    return this.orderModel
      .findOneAndUpdate(
        filter,
        { ...updateOrderDto, updated_at: new Date() },
        { new: true }
      )
      .exec();
  }

  async remove(_id: string) {
    return this.orderModel.findOneAndRemove({ _id }).exec();
  }
}
