import { Model } from "mongoose";
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Countries, CountryDocument } from "./schemas/country.schema";
import { CreateCountryDto } from "./dto/create-country-dto";
import { MESSAGES } from "../const";

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Countries.name) private countriesModel: Model<CountryDocument> // private mailService: MailService,
  ) {}

  async create(createServiceDto: CreateCountryDto): Promise<Countries> {
    const createdService = new this.countriesModel(createServiceDto);

    if (!createdService._id) throw new UnprocessableEntityException();

    return createdService.save();
  }

  async findAll(filter: { [key: string]: any } = {}): Promise<Countries[]> {
    return this.countriesModel.find(filter).sort({ _id: -1 }).exec();
  }

  async findOne(
    filter: { [key: string]: any },
    throwError = true
  ): Promise<Countries | null> {
    const country = await this.countriesModel.findOne(filter).exec();

    if (!country && throwError)
      throw new NotFoundException(
        MESSAGES.MISSING_RESOURCE.replace("{0}", "Country")
      );

    return country;
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

  async remove(_id: string): Promise<Countries | null> {
    return this.countriesModel.findOneAndRemove({ _id }).exec();
  }
}
