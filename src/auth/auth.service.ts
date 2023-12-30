import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(login: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: login.email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email ${login.email}`);
    }

    const isPasswordValid = await bcrypt.compare(login.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password`);
    }

    return {
      accessToken: await this.jwtService.signAsync({ userId: user.id }),
    };
  }
}
