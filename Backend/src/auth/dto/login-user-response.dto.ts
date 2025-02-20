import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginUserResponseDto {
  @ApiProperty({
    title: 'JWT Token',
    example: 'jwt-token',
  })
  @Expose()
  token!: string;

  @ApiProperty({
    title: 'Refresh Token',
    example: 'refresh-token',
  })
  @Expose()
  refreshToken!: string;
}
