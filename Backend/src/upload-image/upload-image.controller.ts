import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiResponseWithData } from 'src/common/decorators/api-response-with-data.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload-image.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @ApiOperation({ summary: 'Upload-Image' })
  @ApiResponseWithData(null, 'Image uploaded successfully', HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-access'))
  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.uploadImageService.uploadFile(file);
  }
}
