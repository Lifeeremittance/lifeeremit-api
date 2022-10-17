import { Model } from "mongoose";
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Charges, ChargeDocument } from "./schemas/charge.schema";
import { UpdateChargeDto } from "./dto/update-charge-dto";
import { MESSAGES } from "../const";

@Injectable()
export class ChargesService {
  constructor(
    @InjectModel(Charges.name) private chargeModel: Model<ChargeDocument> // private mailService: MailService,
  ) {}

  async update(updateChargeDto: UpdateChargeDto): Promise<Charges | null> {
    return this.chargeModel
      .findOneAndUpdate({}, { ...updateChargeDto, updated_at: new Date() })
      .exec();
  }

  async create(updateChargeDto: UpdateChargeDto): Promise<Charges> {
    const updatedRate = new this.chargeModel(updateChargeDto);

    if (!updatedRate._id) throw new UnprocessableEntityException();

    return updatedRate.save();
  }

  async findAll(filter: { [key: string]: any } = {}): Promise<Charges[]> {
    return this.chargeModel.find(filter).sort({ _id: -1 }).exec();
  }

  async findOne(
    filter: { [key: string]: any },
    throwError = true
  ): Promise<Charges | null> {
    const country = await this.chargeModel.findOne(filter).exec();

    if (!country && throwError)
      throw new NotFoundException(
        MESSAGES.MISSING_RESOURCE.replace("{0}", "Charge")
      );

    return country;
  }
}
