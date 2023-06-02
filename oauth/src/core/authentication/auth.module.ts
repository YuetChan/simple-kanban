import { Module } from '@nestjs/common';

import { GoogleOauthStrategy } from './google-oauth/google-oauth.strategy';

import { GoogleOauthModule } from './google-oauth/google-oauth.module';
import { JwtAuthModule } from './jwt/jwt-auth.module';

import { JwtAuthService } from './jwt/jwt-auth.service';

@Module({
    imports: [ GoogleOauthModule, JwtAuthModule ],
    providers: [
        GoogleOauthStrategy,
        JwtAuthService
    ],
    exports: [ JwtAuthService ],
})
export class AuthModule {}
