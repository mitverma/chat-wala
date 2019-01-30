import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthUser } from '../../providers/entities/entities';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-login',
 	templateUrl: 'login.html',
 })
 export class LoginPage {

 	constructor(public navCtrl: NavController, public navParams: NavParams, public User: AuthUser) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad LoginPage', this.User); 
 	}

 }
