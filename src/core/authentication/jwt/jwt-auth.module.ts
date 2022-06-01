import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RegistrationModule } from 'src/registration/registration.module';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';

@Module({
  imports: [
    RegistrationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configSvc: ConfigService) => {
        return {
          secret: configSvc.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: configSvc.get<string>('JWT_EXPIRED_IN') },
        }
      },

      inject: [ConfigService],
    })
  ],
  providers: [JwtAuthStrategy, JwtAuthService],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
