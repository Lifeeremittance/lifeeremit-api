import { Model } from "mongoose";
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Currencies, CurrencyDocument } from "./schemas/currency.schema";
import { CreateCurrencyDto } from "./dto/create-currency-dto";
import { MESSAGES } from "../const";

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectModel(Currencies.name)
    private currenciesModel: Model<CurrencyDocument> // private mailService: MailService,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currencies> {
    const createdCurrency = new this.currenciesModel(createCurrencyDto);

    if (!createdCurrency._id) throw new UnprocessableEntityException();

    return createdCurrency.save();
  }

  async findAll(filter: { [key: string]: any } = {}): Promise<Currencies[]> {
    return this.currenciesModel.find(filter).sort({ _id: -1 }).exec();
  }

  async findOne(
    filter: { [key: string]: any },
    throwError = true
  ): Promise<Currencies | null> {
    const currency = await this.currenciesModel.findOne(filter).exec();

    if (!currency && throwError)
      throw new NotFoundException(
        MESSAGES.MISSING_RESOURCE.replace("{0}", "Currency")
      );

    return currency;
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

  async remove(_id: string): Promise<Currencies | null> {
    return this.currenciesModel.findOneAndRemove({ _id }).exec();
  }
}
