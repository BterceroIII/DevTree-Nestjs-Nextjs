import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the User',
    required: true,
    example: 'example@gamil.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'The password of the User',
    maxLength: 255,
    minLength: 8,
    required: true,
    example: 'password123',
  })
  @IsString({ message: 'Password must be a string' })
  @MaxLength(255, { message: 'Password must be at most 255 characters' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
