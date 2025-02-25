import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageProvider } from './upload-image';
import { UploadImageController } from './upload-image.controller';

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageService, UploadImageProvider],
  exports: [UploadImageService, UploadImageProvider],
})
export class UploadImageModule {}
