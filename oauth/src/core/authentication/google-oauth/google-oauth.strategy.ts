import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {

  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT,
      scope: ['email', 'profile'],
    });
  }

  async validate (
    accessToken: string, 
    refreshToken: string, 
    profile: any): Promise<any> {
    console.trace('Enter validate(accessToken, refreshToken, profile)');

    const { id, name, emails } = profile;
    return {
      providerId: id,
      provider: 'google',
      
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName
    }
  }
}