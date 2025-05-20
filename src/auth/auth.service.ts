import { BadRequestException, Injectable } from '@nestjs/common';
import { SQLITE_ERROR_CODES } from 'src/common/constants/error-codes.constant';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LogInDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(register: RegisterDto): Promise<User> {
    const { email, name, password } = register;

    try {
      const user = new User();

      user.email = email;
      user.name = name;
      user.password = await this.tokenService.createHash(password);

      return await this.usersService.create(user);
    } catch (error) {
      if (error?.code === SQLITE_ERROR_CODES.SQLITE_CONSTRAINT) {
        throw new BadRequestException('Email already exists');
      }

      throw error;
    }
  }

  async authenticate({ email, password }: LogInDto): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await this.tokenService.compareHash(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  async login(
    loginDto: LogInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authenticate(loginDto);
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken();
    await this.tokenService.storeRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return true;
  }
}
