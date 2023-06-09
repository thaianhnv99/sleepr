import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, NOTIFICATION_SERVICE } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule, AUTH_SERVICE } from '@app/common';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URL: Joi.string().required(),
        PORT: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.string().required(),
        NOTIFICATION_HOST: Joi.string().required(),
        NOTIFICATION_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule.forFeature([
      {
        name: ReservationDocument.name,
        schema: ReservationSchema,
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATION_HOST'),
            port: configService.get('NOTIFICATION_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
