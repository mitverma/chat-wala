import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth'
import { UserServiceProvider } from '../../providers/user-service/user-service'


@IonicPage()
@Component({
	selector: 'page-register',
	templateUrl: 'register.html',
})
export class RegisterPage {
	userDetail: Object = {};
	constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider, public userService: UserServiceProvider) {
		this.userDetail = {
			name: '',
			email: '',
			password:''
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}

	register(formDetail){
		if (formDetail && formDetail.valid) {
			this.authService.signup(this.userDetail).then(user=>{
				if (user) {
					// set to user list
					this.userService.setToUserList(user);
					// set to user list end
					this.navCtrl.setRoot('HomePage');
				}
			}).catch(error=>{
				console.log(error.message, 'error login');
				console.log(this.userDetail, 'user detail');
				this.authService.login(this.userDetail['email'], this.userDetail['password']);
			})
		}
	}

}
