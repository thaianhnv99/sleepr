import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }
}
