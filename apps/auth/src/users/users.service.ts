import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(user: CreateUserDto) {
    return this.userRepository.create(user);
    // try {
    //   const newUser = await this.userRepository.create(user);
    //   console.log(newUser);

    //   return newUser;
    // } catch (error) {}
  }
}
