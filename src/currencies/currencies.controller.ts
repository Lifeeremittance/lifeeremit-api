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
  import { Currencies } from "./schemas/currency.schema";
  import { CurrenciesService } from "./currencies.service";
  import { CreateCurrencyDto } from "./dto/create-currency-dto";
  // import { UpdateUserDto } from './dto/update-user.dto';
  
  @Controller("currencies")
  export class CurrenciesController {
    constructor(private readonly currenciesService: CurrenciesService) {}
  
    @Roles(ROLE.ADMIN)
    @Post()
    async create(@Body() CreateCurrencyDto: CreateCurrencyDto) {
      const { currencyName, currencyCode } = CreateCurrencyDto;
  
      const existingCurrency = await this.currenciesService.findOne(
        { currencyName, currencyCode },
        false
      );
  
      if (existingCurrency)
        throw new UnprocessableEntityException(MESSAGES.EXISTING_CURRENCY);
  
      const createdCurrency = await this.currenciesService.create(CreateCurrencyDto);
  
      return {
        status: STATUS.SUCCESS,
        data: createdCurrency,
      };
    }
  
    @Public()
    @Get()
    async findAll(
      @Request() req: { [key: string]: any }
    ): Promise<{ status: STATUS; data: Currencies[] }> {
      const currencies = await this.currenciesService.findAll(req.query);
  
      return {
        status: STATUS.SUCCESS,
        data: currencies,
      };
    }
  
    @Get(":id")
    async findOne(
      @Param("id") id: string
    ): Promise<{ status: STATUS; data: Currencies | null }> {
      const currency = await this.currenciesService.findOne({ _id: id });
  
      return {
        status: STATUS.SUCCESS,
        data: currency,
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
      const deletedUser = await this.currenciesService.remove(id);
  
      return {
        status: deletedUser ? STATUS.SUCCESS : STATUS.ERROR,
      };
    }
  }
  