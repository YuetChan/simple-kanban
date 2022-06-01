import { Module } from '@nestjs/common';
import { GoogleOauthStrategy } from './google-oauth/google-oauth.strategy';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { JwtAuthStrategy } from './jwt/jwt-auth.strategy';
import { GoogleOauthModule } from './google-oauth/google-oauth.module';
import { JwtAuthModule } from './jwt/jwt-auth.module';

@Module({
  imports: [GoogleOauthModule, JwtAuthModule],
  providers: [
    GoogleOauthStrategy,
    JwtAuthService, 
    JwtAuthStrategy
  ],
  exports: [JwtAuthService],
})
export class AuthModule {}
