import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponseWithData } from 'src/common/decorators/api-response-with-data.decorator';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User register' })
  @ApiResponseWithData(
    CreateUserResponseDto,
    'User Create succesfully',
    HttpStatus.CREATED,
  )
  @ApiResponseWithData(null, 'User not created', HttpStatus.BAD_REQUEST)
  @Post('register')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseDto<CreateUserResponseDto>> {
    const user = await this.authService.create(createUserDto);
    return ApiResponseDto.Success(
      user,
      'User created successfully',
      'User completed registration',
    );
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
