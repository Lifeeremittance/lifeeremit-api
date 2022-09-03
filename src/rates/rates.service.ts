import { Model } from "mongoose";
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Rates, RateDocument } from "./schemas/rate.schema";
import { UpdateRateDto } from "./dto/update-rate-dto";
import { MESSAGES } from "../const";

@Injectable()
export class RatesService {
  constructor(
    @InjectModel(Rates.name) private ratesModel: Model<RateDocument> // private mailService: MailService,
  ) {}

  async update(updateRateDto: UpdateRateDto): Promise<Rates | null> {
    const { provider } = updateRateDto
    return this.ratesModel
      .findOneAndUpdate(
        { provider },
        { ...updateRateDto, updated_at: new Date() },
        { new: true },
      )
      .exec();
  }

  async create(updateRateDto: UpdateRateDto): Promise<Rates> {
    const createdRate = new this.ratesModel(updateRateDto);

    if (!createdRate._id) throw new UnprocessableEntityException();

    return createdRate.save();
  }

  async findOne(
    filter: { [key: string]: any },
    throwError = true
  ): Promise<Rates[] | null> {
    const rates = await this.ratesModel.find(filter).sort({ _id: -1 }).exec();

    if (!rates && throwError)
      throw new NotFoundException(
        MESSAGES.MISSING_RESOURCE.replace("{0}", "Rate")
      );

    return rates;
  }

  async remove(_id: string): Promise<Rates | null> {
    return this.ratesModel.findOneAndRemove({ _id }).exec();
  }
}
