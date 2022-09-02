import { Model } from "mongoose";
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Products, ProductDocument } from "./schemas/products.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { EMAILS, MESSAGES, ORDER_STATUS } from "../const";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private providerModel: Model<ProductDocument>
  ) // private mailService: MailService,
  {}

  statusList(): Promise<string[]> {
    return Promise.resolve(Object.values(ORDER_STATUS)?.sort());
  }

  async create(createUserDto: CreateProductDto): Promise<Products> {
    const createdUser = new this.providerModel(createUserDto);

    if (!createdUser._id) throw new UnprocessableEntityException();

    //   await this.mailService.sendMail(
    //     createdUser.email_address,
    //     EMAILS.CONFIRMATION.SUBJECT,
    //     EMAILS.CONFIRMATION.TEMPLATE_NAME,
    //     {
    //       username: createdUser.username,
    //       token,
    //     },
    //   );

    return createdUser.save();
  }

  async findAll(filter: { [key: string]: any } = {}): Promise<Products[]> {
    return this.providerModel.find(filter).sort({ _id: -1 }).exec();
  }

  async findOne(
    filter: { [key: string]: any },
    throwError = true
  ): Promise<Products | null> {
    const user = await this.providerModel.findOne(filter).exec();

    if (!user && throwError)
      throw new NotFoundException(
        MESSAGES.MISSING_RESOURCE.replace("{0}", "User")
      );

    return user;
  }

  // async update(
  //   _id: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<User | null> {
  //   return this.userModel
  //     .findOneAndUpdate(
  //       { _id },
  //       { ...updateUserDto, updated_at: new Date() },
  //       { new: true },
  //     )
  //     .exec();
  // }

  async remove(_id: string): Promise<Products | null> {
    return this.providerModel.findOneAndRemove({ _id }).exec();
  }
}
