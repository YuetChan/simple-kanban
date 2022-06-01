import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(configSvc: ConfigService) {
    super({
      clientID: configSvc.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configSvc.get<string>('GOOGLE_SECRET'),
      
      callbackURL: configSvc.get<string>('GOOGLE_REDIRECT'),
      scope: ['email', 'profile'],
    });
  }

  async validate (
    accessToken: string, 
    refreshToken: string, 
    profile: any): Promise<any> {
    const { id, name, emails } = profile;
    return {
      providerId: id,
      provider: 'google',
      
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName
    }
  }
}