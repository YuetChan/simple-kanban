import { HttpStatus, Injectable, InternalServerErrorException, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import axios from "axios";

import { User } from "src/model/user.model";

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {

	constructor(private jwtSvc: JwtService) { }

  	async use(req: any, res: any, next: () => void) {
		const jwt = req.headers['authorization']?.replace('Bearer ', '');

		if(jwt) { 
			const { email } = this.jwtSvc.decode(jwt) as User;

			req.user = await axios.get(
				`${process.env.APISERVER_HOST}/users`, {
					params: {
						email: email
					}
			}).then(res => {
				if(res.status === HttpStatus.OK) {
					return res.data.data.user;
				}
				
				throw new InternalServerErrorException();
			}).catch(err => {
				console.debug('Err ', err)
				throw new InternalServerErrorException();
			});
		
		}else { 
			req.user = null;
		}

    	next();
  }

}