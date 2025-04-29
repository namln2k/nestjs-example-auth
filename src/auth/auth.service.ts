import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { APP_CONSTANTS } from 'src/common/constants/app.constant';
import { SQLITE_ERROR_CODES } from 'src/common/constants/error-codes.constant';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LogInDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createHash(password: string): Promise<string> {
    return await bcrypt.hash(password, APP_CONSTANTS.HASH_ROUNDS);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async register(register: RegisterDto): Promise<User> {
    const { email, name, password } = register;

    try {
      const user = new User();

      user.email = email;
      user.name = name;
      user.password = await this.createHash(password);

      return await this.usersService.create(user);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

    const isPasswordMatch = await this.compareHash(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LogInDto): Promise<{ accessToken: string }> {
    const user = await this.authenticate(loginDto);

    return await this.generateAccessToken(user);
  }

  async generateAccessToken(
    user: Partial<User>,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return { accessToken };
  }
}
