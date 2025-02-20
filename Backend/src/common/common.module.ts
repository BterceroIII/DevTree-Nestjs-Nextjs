import { Module } from '@nestjs/common';
import { PasswordHasherService } from './services/password-hasher.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PasswordHasherService],
  exports: [],
})
export class CommonModule {}
