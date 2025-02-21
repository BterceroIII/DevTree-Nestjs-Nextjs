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
import { add } from 'date-fns';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
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

    const expireAt = add(new Date(), { days: 7 });

    const savedRefreshToken = this.refreshTokenRepository.create({
      refreshToken,
      expiresAt: expireAt,
      user,
    });
    await this.refreshTokenRepository.save(savedRefreshToken);

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
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      if (!payload || !payload.id) {
        throw new UnauthorizedException('Invalid refresh token payload');
      }

      // Busca el refresh token en la base de datos
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { refreshToken },
        relations: ['user'],
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // Verifica que el token no haya expirado
      if (storedToken.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Opcional: eliminar el refresh token usado, para rotación de tokens
      await this.refreshTokenRepository.remove(storedToken);
      // Genera un nuevo access token
      const newAccessToken = this.getJwtToken({ id: storedToken.user.id });

      // Genera un nuevo refresh token
      const newRefreshToken = this.getRefreshToken({ id: storedToken.user.id });
      const newExpiresAt = add(new Date(), { days: 7 }); // o según tu configuración

      const newTokenEntity = this.refreshTokenRepository.create({
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
        user: storedToken.user,
      });
      await this.refreshTokenRepository.save(newTokenEntity);
      
      return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      };

    } catch (error) {
      if (error instanceof Error) {
        switch (error.name) {
          case 'TokenExpiredError':
            throw new UnauthorizedException('Refresh token expired');
          case 'JsonWebTokenError':
            throw new UnauthorizedException('Invalid refresh token');
          default:
            throw new InternalServerErrorException(
              'An unexpected error occurred during token refresh.',
            );
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during token refresh.',
      );
    }
  }
}

