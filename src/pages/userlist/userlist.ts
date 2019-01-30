import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController  } from 'ionic-angular';

import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthProvider } from '../../providers/auth/auth'
import { RoomserviceProvider } from '../../providers/roomservice/roomservice'
import { MessageServiceProvider } from '../../providers/message-service/message-service'





/**
 * Generated class for the UserlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-userlist',
 	templateUrl: 'userlist.html',
 })
 export class UserlistPage {
 	userList: any; 	
 	currentIndex: number = -1;
 	selectedList: any;
 	searchUserList : any;
 	constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserServiceProvider, public authService: AuthProvider, public roomService: RoomserviceProvider, public alertCtrl : AlertController, public messageService:MessageServiceProvider) {
 		this.userList = [];
 		this.selectedList = [];
 	}

 	ionViewDidLoad() {
 		this.authService.ensureAuthenticate().then((user)=>{
 			this.getUserList();
 			this.userService.UserMessageListiner();
 		});
 	}

 	getUserList(){
 		this.userService.getUserList().subscribe((res)=>{
 			if (res && res.length) {
 				console.log(res, 'response');
 				this.userList = res.filter((val)=>{
 					return val !== undefined;
 				});

 				this.searchUserList = this.userList;
 			}
 		})
 	}

 	createRoomList(userValue){
 		console.log(userValue);
 		if (this.selectedList.length) {
 			this.currentIndex = this.selectedList.indexOf(userValue);
 		}
 		if (this.currentIndex !== -1) {
 			this.selectedList.splice(this.currentIndex, 1);
 		}else{ 			
 			this.selectedList.push(userValue);
 		}
 		this.currentIndex = -1;
 	}

 	getItems(event: any){
 		const val = event.target.value;
 		if (val && val.trim() != '') {
 			this.userList = this.searchUserList.filter((item) => {
 				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
 			})
 		}else {
 			this.userList = this.searchUserList;
 		}
 	}


 	createNewRoom(roomName){
 		let roomDetail = {
 			name: roomName,
 		}
 		this.roomService.createRoom(roomDetail, this.selectedList).then((user)=>{

 		})
 	}

 	setGroupNameAlert(){
 		let alert = this.alertCtrl.create({
 			title: 'Create Room',
 			message: 'Name your group?',
 			inputs: [
 			{
 				name: 'groupname',
 				placeholder: 'Group Name'
 			}
 			],
 			buttons: [
 			{
 				text: 'Cancel',
 				role: 'cancel',
 				handler: () => {

 				}
 			},
 			{
 				text: 'Create',
 				handler: data => {
 					let roomName = data && data.groupname ? data.groupname: 'testing' ;
 					this.createNewRoom(roomName);
 				}
 			}
 			]
 		});
 		alert.present();
 	}

 	chatToUser(userData){
 		this.navCtrl.push('ChatPage',userData);
 	}

 }
