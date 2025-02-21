import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'Refresh token value',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  refreshToken: string;
}