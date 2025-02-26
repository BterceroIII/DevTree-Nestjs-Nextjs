import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The handle of the User',
    maxLength: 255,
    required: true,
    example: 'example',
  })
  @IsString({ message: 'Handle must be a string' })
  @MaxLength(255, { message: 'Handle must be at most 255 characters' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsOptional()
  handle: string;

  @ApiProperty({
    description: 'The description of the User',
    maxLength: 255,
    example: 'Example Description',
  })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description must be at most 255 characters' })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'The links of the User',
    required: true,
    example: ['https://www.linkedin.com/in/yasser-m-b373117/'],
  })
  @IsString({ each: true, message: 'Links must be strings' })
  @IsOptional()
  links: string[];
}
