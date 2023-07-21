import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { RegisterService } from "../../../registration/register.service";

@Injectable()
export class JwtAuthService {
  
    constructor(
        private jwtSvc: JwtService,
        private registerSvc: RegisterService) { }

    async getJwt(user, loginType: LoginType) {
        if(loginType === LoginType.GOOGLE) {
            console.debug("Google signin");

            try {
                const registeredUser = await this.registerSvc.register({
                    email: user.email,
                    name: user.name
                });

                return this.jwtSvc.sign({ 
                    provider: user.provider,
  
                    id: registeredUser.id,
                    email: registeredUser.email,
                    name: registeredUser.name,

                    justRegistered: registeredUser.justRegistered
                }) ;
            }catch(e) {
                console.error("Err", e);
                throw new InternalServerErrorException();
            }
        }

        return this.jwtSvc.sign({ 
            provider: "simple_kanban",

            id: user.id,
            email: user.email,
            name: user.name,
            
            justRegistered: user.justRegistered
        });
    
    }
}

export enum LoginType { GOOGLE }