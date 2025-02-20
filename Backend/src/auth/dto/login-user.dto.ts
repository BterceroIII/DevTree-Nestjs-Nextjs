import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @Expose()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
    format: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @Expose()
  password!: string;
}
