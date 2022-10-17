import { Controller, Get, Body, Put, Request } from "@nestjs/common";
import { Roles } from "../decorators/roles.decorator";
import { Public } from "../decorators/is-public.decorator";
import { MESSAGES, ROLE, STATUS } from "../const";
import { Charges } from "./schemas/charge.schema";
import { ChargesService } from "./charges.service";
import { UpdateChargeDto } from "./dto/update-charge-dto";

@Controller("charges")
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Roles(ROLE.ADMIN)
  @Put()
  async update(
    @Body() updateRateDto: UpdateChargeDto,
    @Request() req: { [key: string]: any }
  ) {
    const existingRate = await this.chargesService.findAll(req.query);

    let updatedRate: Charges;
    if (typeof existingRate !== "undefined" && existingRate.length === 0)
      updatedRate = await this.chargesService.create(updateRateDto);
    else updatedRate = await this.chargesService.update(updateRateDto);

    return {
      status: updatedRate ? STATUS.SUCCESS : STATUS.ERROR,
      message: updatedRate ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
      data: updatedRate,
    };
  }

  @Get()
  async findAll(
    @Request() req: { [key: string]: any }
  ): Promise<{ status: STATUS; data: Charges[] }> {
    const charges = await this.chargesService.findAll(req.query);

    return {
      status: STATUS.SUCCESS,
      data: charges,
    };
  }
}
