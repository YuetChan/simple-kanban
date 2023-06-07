import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";

import axios from "axios";

import { User } from "src/model/user.model";

@Injectable()
export class RegisterService {

  	constructor() { }

  	async register(user: User): Promise<User> {
		return this.getOrCreateUser(user);
  	}

	async getOrCreateUser(user: User) {
		return axios.get(`${process.env.APISERVER_URL}/users`, { 
			params: { 
				email: user.email 
			} 
		}).then(async res => {
			console.debug("Get role by id");

			const user = res.data.data.user;
			const role = await this.getRoleById(user.id)

			return {
				id: user.id,

				email: user.email as string,
				name: user.name as string,
				role: role
			};
		}).catch(async err => {
			console.debug("Create user");
			
			const _user = await this.createUser(user)
			
			return {
				id: _user.id,
				email: user.email,
				name: user.name,
				role: "user"
			}
		});
	}

	async getRoleById(id): Promise<string> {
		return await axios.get(`${process.env.APISERVER_URL}/users/${id}/role`).then(res => {
			if(res.status === HttpStatus.OK) { 
				return res.data.data.role; 
			}
				
			throw new InternalServerErrorException();
		}).catch(err => {
				console.debug("Err", err);
				throw new InternalServerErrorException();
		});
	}

	async createUser(user): Promise<User> {
		return await axios.post<{ data: { user: any } }>(`${process.env.APISERVER_URL}/users`, {
			data: {
				user: {
					email: user.email,
					role: "user"
				}
			}
		}).then(res => {
			if(res.status !== HttpStatus.CREATED) { 
				throw new InternalServerErrorException(); 
			}

			return res.data.data.user;
		}).catch(err => {
			console.debug("Err", err);
			throw new InternalServerErrorException();
		});
	}

}
