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
import { ZohoService } from "../zoho/zoho.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly zohoService: ZohoService
  ) {}

  @Roles(ROLE.ADMIN)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const { name } = createProductDto;

    const existingProduct = await this.productsService.findOne({ name }, false);

    if (existingProduct)
      throw new UnprocessableEntityException(MESSAGES.EXISTING_PRODUCT);

    const { access_token } = await this.zohoService.getAccessToken();

    const res = await this.zohoService.createItem(access_token, {
      name: createProductDto.name,
      rate: 1,
    });

    const {
      item: { item_id },
    } = res;

    const createdProduct = await this.productsService.create({
      ...createProductDto,
      item_id,
    });

    return {
      status: STATUS.SUCCESS,
      data: createdProduct,
    };
  }

  @Public()
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

  @Public()
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

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const updatedUser = await this.productsService.update(id, updateProductDto);

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
