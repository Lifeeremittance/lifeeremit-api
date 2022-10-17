import {
  Controller,
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Roles } from "../decorators/roles.decorator";
import { Public } from "../decorators/is-public.decorator";
import { MESSAGES, ROLE, STATUS } from "../const";
import { Rates } from "./schemas/rate.schema";
import { RatesService } from "./rates.service";
import { UpdateRateDto } from "./dto/update-rate-dto";
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller("rates")
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Roles(ROLE.ADMIN)
  @Put()
  async update(@Body() updateRateDto: UpdateRateDto) {
    const { provider, country, currency } = updateRateDto;

    const existingRate = await this.ratesService.findAll(
      { provider, country, currency },
      false
    );

    let updatedRate: Rates;
    if (typeof existingRate !== "undefined" && existingRate.length === 0)
      updatedRate = await this.ratesService.create(updateRateDto);
    else updatedRate = await this.ratesService.update(updateRateDto);

    return {
      status: updatedRate ? STATUS.SUCCESS : STATUS.ERROR,
      message: updatedRate ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
      data: updatedRate,
    };
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @Request() req: { [key: string]: any }
  ): Promise<{ status: STATUS; data: Rates[] | null }> {
    const rates = await this.ratesService.findAll({
      ...req.query,
      provider: id,
    });

    return {
      status: STATUS.SUCCESS,
      data: rates,
    };
  }

  @Public()
  @Post()
  async findRateByAmount(
    @Body() getRateDto: UpdateRateDto
  ): Promise<{ status: STATUS; data: Rates | null }> {
    const { provider, country, currency } = getRateDto;

    const rate = await this.ratesService.findOne({
      provider,
      country,
      currency,
    });

    return {
      status: STATUS.SUCCESS,
      data: rate,
    };
  }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @Request() req: { user: User },
  // ) {
  //   if (!isAppropriateViewer(req.user, [ROLE.ADMIN], id))
  //     throw new UnauthorizedException();

  //   const updatedUser = await this.usersService.update(id, updateUserDto);

  //   return {
  //     status: updatedUser ? STATUS.SUCCESS : STATUS.ERROR,
  //     data: updatedUser ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
  //   };
  // }

  @Roles(ROLE.ADMIN)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const deletedRate = await this.ratesService.remove(id);

    return {
      status: deletedRate ? STATUS.SUCCESS : STATUS.ERROR,
    };
  }
}
