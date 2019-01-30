import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RoomserviceProvider } from '../../providers/roomservice/roomservice';

/**
 * Generated class for the RoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-room',
 	templateUrl: 'room.html',
 })
 export class RoomPage {

 	constructor(public navCtrl: NavController, public navParams: NavParams, public roomService: RoomserviceProvider) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad RoomPage');
 	}

 	getAllRooms(){
 		this.roomService.loadGroups().then((value)=>{
 			console.log(value, 'value');
 		})
 	}

 }
