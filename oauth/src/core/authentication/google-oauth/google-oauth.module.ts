import { Module } from '@nestjs/common';

import { GoogleOauthStrategy } from './google-oauth.strategy';

import { JwtAuthModule } from '../jwt/jwt-auth.module';

import { GoogleOauthController } from './google-oauth.controller';

@Module({
    imports: [ JwtAuthModule ],
    providers: [ GoogleOauthStrategy ],
    controllers: [ GoogleOauthController ],
})
export class GoogleOauthModule { }