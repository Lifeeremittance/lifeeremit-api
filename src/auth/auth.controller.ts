import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "./../users/schemas/user.schema";
import { AuthService } from "./auth.service";
import { UsersService } from "./../users/users.service";
import { LocalAuthGuard } from "./../auth/guards/local-auth.guard";
import { Public } from "./../decorators/is-public.decorator";
import { ENVIRONMENT, RESPONSES, STATUS } from "./../const";
import { RequestTokenDto } from "./dto/request-token.dto";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("auth/login/token")
  async requestLoginToken(
    @Body() requestTokenDto: RequestTokenDto
  ): Promise<{ status: STATUS; data: string }> {
    const isTokenSent = await this.authService.requestLoginToken(
      requestTokenDto.email_address,
      requestTokenDto.entity
    );

    if (!isTokenSent) throw new UnauthorizedException();

    return {
      status: STATUS.SUCCESS,
      data: RESPONSES.TOKEN_SENT,
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("auth/login")
  async login(
    @Request() req: { user: User }
    // @Body() validateTokenDto: ValidateTokenDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Get("profile")
  async getProfile(
    @Request() req: { user: User }
  ): Promise<{ status: STATUS; data: User | null }> {
    const user = await this.usersService.findOne({ _id: req.user._id }, false);

    return {
      status: user ? STATUS.SUCCESS : STATUS.ERROR,
      data: user,
    };
  }
}
