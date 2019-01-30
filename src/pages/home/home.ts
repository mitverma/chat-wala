import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RoomserviceProvider } from '../../providers/roomservice/roomservice'
import { UserServiceProvider } from '../../providers/user-service/user-service'
import { AuthProvider } from '../../providers/auth/auth'
import { OrderByPipe } from '../../pipes/filters/filters';
import { RoomDetail } from  '../../providers/entities/entities'
import { AuthUser } from '../../providers/entities/entities';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-home',
 	templateUrl: 'home.html',
 	providers: [OrderByPipe]
 })
 export class HomePage {
 	chatList: any = [];
 	currentActiveList: any = [];
 	constructor(public navCtrl: NavController, public navParams: NavParams, public roomService: RoomserviceProvider, public authService: AuthProvider, public userService: UserServiceProvider, public orderBy: OrderByPipe, public roomDetail: RoomDetail, public User: AuthUser) {
 		this.authService.ensureAuthenticate().then(user=>{
 			this.loadGroupsAndUsers();
 			this.userService.UserMessageListiner();
 		})
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad HomePage');
 		
 	}

 	// load group and users 

 	loadGroupsAndUsers(){
 		this.roomService.loadGroupsLastConv().then(roomList=>{
 			if (roomList && roomList.length) {
 				this.currentActiveList = roomList;
 			}
 			this.userService.loadUserList().then(userList=>{
 				let userFinalList : any = [];
 				if (userList && userList.length) {
 					console.log(userList, 'user list');
 					this.userService.loadUsersListAddEventListener().then(convList=>{
 						if (convList) {
 							userList.forEach((list)=>{
 								convList.forEach((conv)=>{ 									
 									if ((list.id == conv.from_userId && conv.to_user_id== this.User.id) || (list.id == conv.to_user_id && conv.from_userId == this.User.id)) {
 										list.last_message_content = conv.text;
 										list.displayDate = conv.timestamp;
 										list.createdAt = conv.timestamp;
 										this.currentActiveList.push(list);
 									}
 								})
 							});
 							console.log(this.currentActiveList, 'current active list');
 							this.currentActiveList = this.orderBy.transform(this.currentActiveList, ['-createdAt']);
 						}
 					}); 					
 				}
 			})
 		});
 	}

 	// load group and users end

 	chatInGroup(groupDetail, redirectTo){
 		let setRoomDetail =  {
 			createdAt: groupDetail.createdAt,
 			lastMessage: groupDetail.last_message_content,
 			roomId: groupDetail.roomId,
 			name: groupDetail.name,
 			lastMessageUser: groupDetail.last_message_user,
 		}
 		Object.assign(this.roomDetail, setRoomDetail);
 		if (redirectTo == 'groupChat') { 			
 			this.navCtrl.push('RoomChatPage', groupDetail);
 		}
 		if(redirectTo == 'groupInfo'){
 			this.navCtrl.push('RoomInfoPage', groupDetail);
 		}
 	}

 	chatToUser(userData){
 		this.navCtrl.push('ChatPage',userData);
 	}

 }
