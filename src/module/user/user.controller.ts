import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() data: UserDto) {
    return this.userService.create(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.userService.login(data);
  }
}
