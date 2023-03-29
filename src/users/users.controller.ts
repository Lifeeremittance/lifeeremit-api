import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Roles } from "../decorators/roles.decorator";
import { Public } from "../decorators/is-public.decorator";
// import { isAppropriateViewer } from '@/utils/is-appropriate-viewer';
import { MESSAGES, ROLE, STATUS } from "../const";
import { User } from "./schemas/user.schema";
import { UsersService } from "./users.service";
import { ZohoService } from "../zoho/zoho.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly zohoService: ZohoService
  ) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { email_address } = createUserDto;

    // const includesAdmin = createUserDto.roles.includes(ROLE.ADMIN);
    // if (includesAdmin) throw new UnauthorizedException();

    const existingUser = await this.usersService.findOne(
      { email_address },
      false
    );

    if (existingUser)
      throw new UnprocessableEntityException(MESSAGES.EXISTING_USER);

    const { access_token } = await this.zohoService.getAccessToken();

    const res = await this.zohoService.createContact(access_token, {
      contact_name: createUserDto.fullName,
      company_name: createUserDto.companyName,
    });

    const {
      contact: { contact_id },
    } = res;

    const createdUser = await this.usersService.create({
      ...createUserDto,
      contact_id,
    });

    return {
      status: STATUS.SUCCESS,
      data: createdUser,
    };
  }

  @Roles(ROLE.ADMIN)
  @Get()
  async findAll(
    @Request() req: { [key: string]: any }
  ): Promise<{ status: STATUS; data: User[] }> {
    const users = await this.usersService.findAll(req.query);

    return {
      status: STATUS.SUCCESS,
      data: users,
    };
  }

  @Get("me")
  async findOne(
    @Request() req: { [key: string]: any }
  ): Promise<{ status: STATUS; data: User | null }> {
    const { _id } = req.user;

    const user = await this.usersService.findOne({ _id }, false);

    return {
      status: STATUS.SUCCESS,
      data: user,
    };
  }

  @Public()
  @Get("/user/:id")
  async findOneById(
    @Param("id") id: string
  ): Promise<{ status: STATUS; data: User | null }> {
    const user = await this.usersService.findOne({ _id: id });

    return {
      status: STATUS.SUCCESS,
      data: user,
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: User }
  ) {
    const updatedUser = await this.usersService.update(id, updateUserDto);

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
