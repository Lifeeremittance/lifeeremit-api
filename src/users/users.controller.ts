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
// import { isAppropriateViewer } from '@/utils/is-appropriate-viewer';
import { MESSAGES, ROLE, STATUS } from "../const";
import { User } from "./schemas/user.schema";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

    const createdUser = await this.usersService.create(createUserDto);

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
    console.log(req.user);
    const { _id } = req.user;

    const user = await this.usersService.findOne({ _id }, false);

    return {
      status: STATUS.SUCCESS,
      data: user,
    };
  }

  @Roles(ROLE.ADMIN)
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

  // @Roles(ROLE.ADMIN)
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const deletedUser = await this.usersService.remove(id);

  //   return {
  //     status: deletedUser ? STATUS.SUCCESS : STATUS.ERROR,
  //   };
  // }
}
