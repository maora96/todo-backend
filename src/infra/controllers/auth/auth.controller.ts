import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/application/services/auth/auth.service';
import { SignInDTO } from './dtos/signin.dto';
import { SignUpDTO } from './dtos/signup.dto';

@Controller('/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: SignInDTO) {
    const content = await this.authService.signIn(body.email, body.password);

    return content;
  }

  @Post('signup')
  async signUp(@Body() body: SignUpDTO) {
    const content = await this.authService.signUp(
      body.email,
      body.password,
      body.name,
    );

    return content;
  }
}
