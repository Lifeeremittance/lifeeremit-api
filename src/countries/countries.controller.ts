import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Roles } from "../decorators/roles.decorator";
import { Public } from "../decorators/is-public.decorator";
import { MESSAGES, ROLE, STATUS } from "../const";
import { Countries } from "./schemas/country.schema";
import { CountriesService } from "./countries.service";
import { CreateCountryDto } from "./dto/create-country-dto";
import { UpdateCountryDto } from './dto/update-country-dto';

@Controller("countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Roles(ROLE.ADMIN)
  @Post()
  async create(@Body() CreateCountryDto: CreateCountryDto) {
    const { countryName, countryFlag } = CreateCountryDto;

    const existingCountry = await this.countriesService.findOne(
      { countryName, countryFlag },
      false
    );

    if (existingCountry)
      throw new UnprocessableEntityException(MESSAGES.EXISTING_COUNTRY);

    const createdCountry = await this.countriesService.create(CreateCountryDto);

    return {
      status: STATUS.SUCCESS,
      data: createdCountry,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Request() req: { [key: string]: any }
  ): Promise<{ status: STATUS; data: Countries[] }> {
    const countries = await this.countriesService.findAll(req.query);

    return {
      status: STATUS.SUCCESS,
      data: countries,
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCountryDto: UpdateCountryDto
  ) {
    const updatedCurrency = await this.countriesService.update(id, updateCountryDto);

    return {
      status: updatedCurrency ? STATUS.SUCCESS : STATUS.ERROR,
      data: updatedCurrency ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
    };
  }

  @Roles(ROLE.ADMIN)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const deletedUser = await this.countriesService.remove(id);

    return {
      status: deletedUser ? STATUS.SUCCESS : STATUS.ERROR,
    };
  }
}
