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
import { Products } from "./schemas/products.schema";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(ROLE.ADMIN)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const { name } = createProductDto;

    const existingProduct = await this.productsService.findOne({ name }, false);

    if (existingProduct)
      throw new UnprocessableEntityException(MESSAGES.EXISTING_PRODUCT);

    const createdProduct = await this.productsService.create(createProductDto);

    return {
      status: STATUS.SUCCESS,
      data: createdProduct,
    };
  }

  @Roles(ROLE.ADMIN)
  @Get()
  async findAll(
    @Request() req: { [key: string]: any }
  ): Promise<{ status: STATUS; data: Products[] }> {
    const products = await this.productsService.findAll(req.query);

    return {
      status: STATUS.SUCCESS,
      data: products,
    };
  }

  @Roles(ROLE.ADMIN)
  @Get(":id")
  async findOne(
    @Param("id") id: string
  ): Promise<{ status: STATUS; data: Products | null }> {
    const product = await this.productsService.findOne({ _id: id });

    return {
      status: STATUS.SUCCESS,
      data: product,
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
