import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponseWithData } from 'src/common/decorators/api-response-with-data.decorator';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponseWithData(
    null,
    'Refresh token is invalid or expired',
    HttpStatus.OK,
  )
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
    const { refreshToken } = refreshTokenDto;
    const token = await this.authService.refreshToken(refreshToken);
    const refreshTokenResponse: RefreshTokenResponseDto = { refreshToken: token.refreshToken };
    return ApiResponseDto.Success(refreshTokenResponse, 'Token Refreshed', 'Token Refreshed');
  }

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

  @ApiOperation({ summary: 'Login an existing user' })
  @ApiResponseWithData(LoginUserDto, 'Your are logged in', HttpStatus.OK)
  @ApiResponseWithData(
    null,
    'Invalid MLS ID. Please ensure your license is active and correct..',
    HttpStatus.BAD_REQUEST,
  )
  //@Public()
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ApiResponseDto<LoginUserResponseDto>> {
    const result = await this.authService.login(loginUserDto);
    return ApiResponseDto.Success(result, 'User Login', 'Your are logged in');
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
