import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SearchUserHandleResponseDto {
  @ApiProperty({
    description: 'The handle of the User',
    maxLength: 255,
    required: true,
    example: 'example',
  })
  @Expose()
  handle: string;

}