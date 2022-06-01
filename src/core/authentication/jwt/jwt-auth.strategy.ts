import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configSvc: ConfigService) {
		super({
	  	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	  	ignoreExpiration: false,
	  	secretOrKey: configSvc.get<string>('JWT_SECRET'),
		});
  }

  async validate(payload) {
		return { 
			provider: payload.provider,
			email: payload.email, 
			name: payload.name 
		};
  }
}