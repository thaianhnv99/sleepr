import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepo: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}
  async create(reservationDto: CreateReservationDto, user: UserDto) {
    try {
      await this.paymentsService
        .send('create_charge', reservationDto.charge)
        .pipe(
          map(async () => {
            return await this.reservationRepo.create({
              ...reservationDto,
              timestamp: new Date(),
              userId: user._id,
            });
          }),
        );
    } catch (error) {
      throw new HttpException('Create failed', HttpStatus.CONFLICT);
    }
  }

  findAll() {
    return this.reservationRepo.find({});
  }

  findOne(_id: string) {
    return this.reservationRepo.findOne({
      _id,
    });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepo.findOneAndUpdate(
      { _id },
      {
        $set: updateReservationDto,
      },
    );
  }

  remove(_id: string) {
    return this.reservationRepo.findOneAndDelete({ _id });
  }
}
