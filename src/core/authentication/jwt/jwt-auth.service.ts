import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterService } from '../../../registration/register.service';

@Injectable()
export class JwtAuthService {
  
  constructor(
    private jwtSvc: JwtService,
    private registerSvc: RegisterService) { }

  async getJwt(user, loginType: LoginType) {
    console.trace('Enter getJwt(user, loginType');

    if(loginType === LoginType.GOOGLE) {
      try {
        console.debug('Register or get user')
        const registeredUser = await this.registerSvc.register({
          email: user.email,
          name: user.name
        });
  
        console.debug('Sign jwt');

        return this.jwtSvc.sign({ 
          provider: user.provider,
  
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
        }) ;
      }catch(e) {
        console.error('Err', e);
        throw new InternalServerErrorException();
      }
    }

    return this.jwtSvc.sign({ 
      provider: 'cup_kanban',

      id: user.id,
      email: user.email,
      name: user.name,
    });
    
  }
}

export enum LoginType { GOOGLE }