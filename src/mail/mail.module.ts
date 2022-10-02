import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL.HOST'),
          port: configService.get('MAIL.PORT'),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get('MAIL.USER'),
            pass: configService.get('MAIL.PASSWORD'),
          },
        },
        defaults: {
          pool: true,
          from: configService.get('MAIL.FROM'),
        },
        template: {
          dir: join(__dirname, '..', '/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
