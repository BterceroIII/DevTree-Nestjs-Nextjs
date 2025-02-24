import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateUserResponseDto {
  @ApiProperty({
    description: 'The handle of the User',
    maxLength: 255,
    required: true,
    example: 'example',
  })
  @Expose()
  handle: string;

  @ApiProperty({
    description: 'The description of the User',
    maxLength: 255,
    example: 'Example Description',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'The links of the User',
    required: true,
    example: ['https://www.linkedin.com/in/yasser-m-b373117/'],
  })
  @Expose()
  links: string[];
}
