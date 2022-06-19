import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

import { DatabaseService } from '../database/database.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto): Promise<{ accessToken: string }> {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.databaseService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate account');
        }
      } else {
        throw error;
      }
    }
  }

  async signin(dto: AuthDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      if (await argon.verify(user.hash, dto.password)) {
        return this.signToken(user.id, user.email);
      } else {
        throw new UnauthorizedException('Incorrect credentials');
      }
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.configService.get('JWT_SECRET'),
      }),
    };
  }
}
