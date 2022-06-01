import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterService } from '../../../registration/register.service';

@Injectable()
export class JwtAuthService {
  
  constructor(
    private jwtSvc: JwtService,
    private registerSvc: RegisterService) { }

  // the user refer to the
  async getJwt(user, loginType: LoginType) {
    if(loginType === LoginType.GOOGLE) {
      try {
        const registeredUser = await this.registerSvc.register({
          email: user.email,
          name: user.name
        })
  
        return this.jwtSvc.sign({ 
          provider: user.provider,
  
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
        }) ;
      }catch(e) {
        console.error(e);
        throw new InternalServerErrorException();
      }
    }

    return this.jwtSvc.sign({ 
      provider: 'cup_fitness',

      id: user.id,
      email: user.email,
      name: user.name,
    });
    
  }
}

export enum LoginType { GOOGLE, HK_PODCAST }