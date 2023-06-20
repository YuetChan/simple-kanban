import { PassportStrategy } from "@nestjs/passport";

import { Injectable } from "@nestjs/common";

import { Strategy } from "passport-google-oauth20";

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, "google") {

    constructor() {
        super({
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            clientID: process.env.GOOGLE_CLIENT_ID,
            
            callbackURL: process.env.GOOGLE_REDIRECT,

            scope: [ "email", "profile" ]
        });
    }

    async validate (
        accessToken: string, 
        refreshToken: string, 
        profile: any): Promise<any> {

        const { id, name, emails } = profile;
        
        return {
            providerId: id,
            provider: "google",
    
            email: emails[0].value,
            name: name.givenName + " " + name.familyName
        }
    }

}