import { CreateChargeDto } from '@app/common';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  placeId: string;

  @IsString()
  invoiceId: string;

  // @IsDefined()
  // @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
