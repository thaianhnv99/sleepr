import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { UsersRepository } from './users.repository';
import { UsersDocument } from './model/users.schema';
import * as bcrypt from 'bcryptjs';
import { Error } from 'mongoose';
import { getUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async getUserById(user: getUserDto): Promise<UsersDocument> {
    try {
      return this.userRepository.findOne(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async create(user: CreateUserDto) {
    const hashedPassword = await this.hashPassword(user.password);
    try {
      const newUser = await this.userRepository.create({
        ...user,
        password: hashedPassword,
      });
      console.log(newUser);

      return newUser;
    } catch (error) {
      throw new HttpException('Create user fails', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyUser(email: string, password: string): Promise<UsersDocument> {
    const exitstingUser = await this.userRepository.findOne({ email });
    // Vì sử dụng local-auth.guards để validate rồi nên ko cần check đoạn dưới này
    // if (!exitstingUser) {
    //   throw new ForbiddenException('Credentials incorrect');
    // }

    //compare password
    const comparePassword = await this.doesPasswordMath(
      password,
      exitstingUser.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return exitstingUser;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async doesPasswordMath(
    passport: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(passport, hashedPassword);
  }
}
