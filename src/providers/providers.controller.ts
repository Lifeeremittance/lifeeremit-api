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
import { Providers } from "./schemas/provider.schema";
import { ProvidersService } from "./providers.service";
import { CreateProviderDto } from "./dto/create-provider.dto";
import { UpdateProviderDto } from './dto/update-provider.dto';

@Controller("providers")
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Roles(ROLE.ADMIN)
  @Post()
  async create(@Body() createProviderDto: CreateProviderDto) {
    const { name } = createProviderDto;

    const existingProvider = await this.providersService.findOne(
      { name },
      false
    );

    if (existingProvider)
      throw new UnprocessableEntityException(MESSAGES.EXISTING_PROVIDER);

    const createdProvider = await this.providersService.create(
      createProviderDto
    );

    return {
      status: STATUS.SUCCESS,
      data: createdProvider,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Request() req: { [key: string]: any }
  ): Promise<{ status: STATUS; data: Providers[] }> {
    const providers = await this.providersService.findAll(req.query);

    return {
      status: STATUS.SUCCESS,
      data: providers,
    };
  }

  @Public()
  @Get(":id")
  async findOne(
    @Param("id") id: string
  ): Promise<{ status: STATUS; data: Providers | null }> {
    const provider = await this.providersService.findOne({ _id: id });

    return {
      status: STATUS.SUCCESS,
      data: provider,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    const updatedUser = await this.providersService.update(id, updateProviderDto);

    return {
      status: updatedUser ? STATUS.SUCCESS : STATUS.ERROR,
      data: updatedUser ? MESSAGES.UPDATE_SUCCESS : MESSAGES.UPDATE_ERROR,
    };
  }

  // @Roles(ROLE.ADMIN)
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const deletedUser = await this.usersService.remove(id);

  //   return {
  //     status: deletedUser ? STATUS.SUCCESS : STATUS.ERROR,
  //   };
  // }
}
