import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordHasherService } from 'src/common/services/password-hasher.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token-strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT Module for Access Tokens
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
        const expiresIn =
          Number(
            configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
          ) || '15m';
        return {
          secret,
          signOptions: {
            expiresIn: expiresIn,
            algorithm: 'HS256',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHasherService,
    JwtService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    LocalStrategy,
  ],
  exports: [
    TypeOrmModule,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
