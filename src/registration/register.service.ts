import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";

import axios from 'axios';
import { User } from "src/model/user.model";

@Injectable()
export class RegisterService {

	private REST_HOST = '';

  constructor() { this.REST_HOST = process.env.REST_HOST; }

  async register(user: User): Promise<User> {
		console.trace('Enter register(user)');

		console.debug('Get user by user email');

		return await axios.get(`${this.REST_HOST}/users`, { 
				params: { email: user.email } 
		}).then(async res => {
			console.debug('Get role by id');

			const user = res.data.data.user;
			const role = await axios.get(`${this.REST_HOST}/users/${user.id}/role`).then(res => {
				if(res.status === HttpStatus.OK) { return res.data.data.role; }
					throw new InternalServerErrorException();
			}).catch(err => {
					console.debug('Err', err);
					throw new InternalServerErrorException();
			});

			return {
				id: user.id,
				email: user.email as string,
				name: user.name as string,
				role: role
			};
		}).catch(async err => {
			console.debug('Create user');

			const res = await axios.post<{ data: { user: any } }>(`${this.REST_HOST}/users`, {
				data: {
					user: {
						email: user.email,
						role: 'user'
					}
				}
			}).then(res => {
				if(res.status !== HttpStatus.CREATED) { throw new InternalServerErrorException(); }
				return res;
			}).catch(err => {
				console.debug('Err', err);
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
