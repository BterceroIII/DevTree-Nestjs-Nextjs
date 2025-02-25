import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithData } from 'src/common/decorators/api-response-with-data.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller()
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @ApiOperation({ summary: 'Upload-Image' })
  @ApiResponseWithData(null, 'Image uploaded successfully', HttpStatus.OK)
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
