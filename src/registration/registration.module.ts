import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegisterService } from './register.service';

@Module({
  imports: [ConfigModule],
  providers: [RegisterService],
  exports: [RegisterService]
})
export class RegistrationModule { }
