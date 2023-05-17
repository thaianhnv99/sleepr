import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepo: ReservationsRepository) {}
  async create(reservationDto: CreateReservationDto) {
    try {
      const newReservation = await this.reservationRepo.create({
        ...reservationDto,
        timestamp: new Date(),
        userId: '123',
      });

      console.log(newReservation);

      return newReservation;
    } catch (error) {
      console.log(error);

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
