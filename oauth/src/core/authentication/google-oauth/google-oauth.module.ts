import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';

@Module({
  imports: [JwtAuthModule],
  providers: [GoogleOauthStrategy],
  controllers: [GoogleOauthController],
})
export class GoogleOauthModule { }