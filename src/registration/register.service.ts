import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from 'axios';

import * as moment from "moment";

@Injectable()
export class RegisterService {

	private REST_HOST = '';

  constructor(private configSvc: ConfigService) { this.REST_HOST = this.configSvc.get<string>('REST_HOST'); }

  async register(user: User): Promise<User> {
		console.log('register', user);

		return await axios.get(
			 `${this.REST_HOST}/users`, { 
				params: {  email: user.email  } 
		}).then(async res => {
			console.log('get user by email', 'res', res)

			const user = res.data.data.user;

			const role = await axios.get(
				 `${this.REST_HOST}/users/${user.id}/role`).then(res => {
					console.log('get user role by id', 'res', res)
					if(res.status === HttpStatus.OK) { return res.data.data.role; }

					console.error(res)
					throw new InternalServerErrorException();
				}).catch(err => {
					console.error(err)
					throw new InternalServerErrorException();
				});

			return {
				id: user.id,
				email: user.email as string,
				name: user.name as string,
				role: role
			};
		}).catch(async err => {
			console.log('get user by email', 'err', err)

			const res = await axios.post<{
				data: {
					user: any
				}
			}>(`${this.REST_HOST}/users`, {
				data: {
					user: {
						email: user.email,
						role: 'user',
						uploadQuota: {
							full: false,
							lastUploadedAt: moment().tz('America/New_York').unix()
						}
					}
				}
			}).then(res => {
				console.log('post user', 'res', res)

				if(res.status !== HttpStatus.CREATED) {
					console.log(res)
					throw new InternalServerErrorException();
				}

				return res;
			}).catch(err => {
				console.log('post user', 'err', err)
				throw new InternalServerErrorException();
			});
			
			return {
				id: res.data.data.user.id,
				email: user.email,
				name: user.name,
				role: 'user'
			}
		});
  }

}
