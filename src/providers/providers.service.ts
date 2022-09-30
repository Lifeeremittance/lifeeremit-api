import { Model } from "mongoose";
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Providers, ProviderDocument } from "./schemas/provider.schema";
import { CreateProviderDto } from "./dto/create-provider.dto";
import { EMAILS, MESSAGES, ORDER_STATUS } from "../const";

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Providers.name) private providerModel: Model<ProviderDocument>
  ) // private mailService: MailService,
  {}

  statusList(): Promise<string[]> {
    return Promise.resolve(Object.values(ORDER_STATUS)?.sort());
  }

  async create(createUserDto: CreateProviderDto): Promise<Providers> {
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

  async findAll(filter: { [key: string]: any } = {}): Promise<Providers[]> {
    return this.providerModel.find(filter).sort({ _id: -1 }).exec();
  }

  async findOne(
    filter: { [key: string]: any },
    throwError = true
  ): Promise<Providers | null> {
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

  async remove(_id: string): Promise<Providers | null> {
    return this.providerModel.findOneAndRemove({ _id }).exec();
  }
}
