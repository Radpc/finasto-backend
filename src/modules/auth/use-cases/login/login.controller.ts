import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { LoginService } from './login.service';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'admin@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'mysecret123' })
  password: string;
}

@Controller()
@ApiTags('User')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // Slow down password guessing: 5 attempts per minute per client
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('/login')
  async handle(@Body() { email, password }: LoginDTO) {
    const res = await this.loginService.execute(email, password);
    return { data: res, message: 'Login success' };
  }
}
