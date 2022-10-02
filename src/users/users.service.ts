import { Model } from "mongoose";
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';
// import { generateToken } from '@/utils/generate-token';
// import { MailService } from '@/mail/mail.service';
import { EMAILS, MESSAGES, ORDER_STATUS } from "../const";

type UpdateDTOType = { [key: string]: any } | UpdateUserDto;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument> // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) // private mailService: MailService,
  {}

  statusList(): Promise<string[]> {
    return Promise.resolve(Object.values(ORDER_STATUS)?.sort());
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    if (!createdUser._id) throw new UnprocessableEntityException();

    //   await this.mailService.sendMail(
    //     createdUser.email_address,
    //     EMAILS.CONFIRMATION.SUBJECT,
    //     EMAILS.CONFIRMATION.TEMPLATE_NAME,
    //     {
    //       username: createdUser.username,
    //       token,
    //     },
    //   );

    return createdUser.save();
  }

  async findAll(filter: { [key: string]: any } = {}): Promise<User[]> {
    return this.userModel.find(filter).sort({ _id: -1 }).exec();
  }

  async findOne(
    filter: { [key: string]: any },
    throwError = true
  ): Promise<User | null> {
    const user = await this.userModel.findOne(filter).exec();

    if (!user && throwError)
      throw new NotFoundException(
        MESSAGES.MISSING_RESOURCE.replace("{0}", "User")
      );

    return user;
  }

  async update(
    _id: string,
    updateUserDto: UpdateDTOType,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(
        { _id },
        { ...updateUserDto, updated_at: new Date() },
        { new: true },
      )
      .exec();
  }

  async remove(_id: string): Promise<User | null> {
    return this.userModel.findOneAndRemove({ _id }).exec();
  }
}
