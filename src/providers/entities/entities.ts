import { Injectable } from '@angular/core';

@Injectable()
export class AuthUser {
	id: string;
	uid: string;
	name: string;
	email: string;
	deviceToken: string;
	status: boolean;
	auth_token: string;
	constructor() {
		console.log('AuthUser Called::');
		this.id = '';
		this.uid = '';
		this.name =  '';
		this.email =  '';
		this.deviceToken =  '';
		this.status =  true;
		this.auth_token =  'APP_USER';
	}

}

@Injectable()
export class RoomDetail {
	roomId: string;
	name: string;
	lastMessage: string;
	createdAt: string;
	lastMessageUser: string;
	constructor(){
		this.roomId = '';
		this.name = '';
		this.lastMessage = '';
		this.createdAt = '';
		this.lastMessageUser = '';
	}
}
