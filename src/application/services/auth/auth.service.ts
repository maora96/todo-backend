import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/domain/model/User/User';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const comparison = this.compare(password, user.password);

    if (!comparison) {
      throw new UnauthorizedException('Login credentials incorret.');
    }

    const payload = { sub: user.id, name: user.name, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, password: string, name: string) {
    const hash = await this.hashData(password);
    const user = new User(name, email, hash, new Date());

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
