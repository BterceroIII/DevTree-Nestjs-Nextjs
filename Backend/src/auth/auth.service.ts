import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { PasswordHasherService } from '../common/services/password-hasher.service';
import { plainToInstance } from 'class-transformer';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHasher: PasswordHasherService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    return await this.userRepository.manager.transaction(async (manager) => {
      const { email, password, handle } = createUserDto;

      const isEmailRegistered = await this.userRepository.findOne({
        where: { email },
      });
      if (isEmailRegistered) {
        throw new BadRequestException('Email already registered');
      }

      const isHandleRegistered = await this.userRepository.findOne({
        where: { handle },
      });
      if (isHandleRegistered) {
        throw new BadRequestException('Handle already registered');
      }

      const hashedPassword = await this.passwordHasher.hashPassword(password);

      const userEntity = manager.create(User, {
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await manager.save(userEntity);

      const responseDto = plainToInstance(CreateUserResponseDto, savedUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      return responseDto;
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const refreshToken = this.getRefreshToken({ id: user.id });
    const token = this.getJwtToken({ id: user.id });

    const userResponse = plainToInstance(
      LoginUserResponseDto,
      { ...user, token, refreshToken },
      {
        excludeExtraneousValues: true,
      },
    );

    return userResponse;
  }

  private getJwtToken(payload: JwtPayload): string {
    //const expiresIn = Number(this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'));
    const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    return this.jwtService.sign(payload, { secret, expiresIn: '71h' });
  }

  private getRefreshToken(payload: JwtPayload): string {
    // const expiresIn = Number(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'));
    const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    return this.jwtService.sign(payload, { secret, expiresIn: '7d' });
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth ${updateUserDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Fetch the user based on the payload from the token
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
        relations: ['refreshToken'],
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid user for refresh token');
      }

      // Fetch the stored token
      const storedToken = user.refreshToken;

      // Check if the token is valid and not expired
      if (
        !storedToken ||
        new Date(storedToken.expiresAt).getTime() < Date.now()
      ) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Return a new JWT token
      return {
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      // Improved error handling for JWT-specific errors
      if (error instanceof Error) {
        switch (error.name) {
          case 'TokenExpiredError':
            this.logger.warn('Refresh token expired');
            throw new UnauthorizedException('Refresh token expired');
          case 'JsonWebTokenError':
            this.logger.warn('Invalid refresh token');
            throw new UnauthorizedException('Invalid refresh token');
          default:
            this.logger.error('Error during refresh token:', error);
            throw new InternalServerErrorException(
              'An unexpected error occurred during token refresh.',
            );
        }
      }

      // Handle unknown errors
      this.logger.error('Unknown error during refresh token:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during token refresh.',
      );
    }
  }
}
