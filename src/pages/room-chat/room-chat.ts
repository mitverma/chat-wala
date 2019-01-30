import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { AuthUser,RoomDetail } from '../../providers/entities/entities';
import { RoomserviceProvider } from  '../../providers/roomservice/roomservice';
import { UserServiceProvider } from '../../providers/user-service/user-service'

/**
 * Generated class for the RoomChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-room-chat',
 	templateUrl: 'room-chat.html',
 })
 export class RoomChatPage {

 	roomChatList: any = [];
 	formMessage: any = {};
 	roomInfo: any = {};
 	groupMemberList: any = [];
 	viewGroupList: boolean = false;
 	remaningUserList: any = [];
 	selectedMemberList: any = [];
 	currentIndex: any = -1;
 	constructor(public navCtrl: NavController, public navParams: NavParams, public messageService: MessageServiceProvider, public User: AuthUser, public events: Events, public ngZone: NgZone, public roomDetail: RoomDetail, public roomService: RoomserviceProvider, public userService: UserServiceProvider) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad RoomChatPage', this.navParams.data, 'nav params data');
 		if (this.navParams.data) {
 			this.roomInfo = this.navParams.data;
 		}
 		let roomId = this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		this.messageService.setUpGroupMessageListiner(roomId).then(res=>{
 			if (res && res.length) {
 				this.getGroupMessage();
 			}
 		});

 		this.events.subscribe('groupMessage:Added', (groupMsg) =>{
 			if (groupMsg) {
 				this.getGroupMessage();
 			}
 		})
 	}

 	getGroupMessage(){
 		let roomId =  this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		this.messageService.bindGroupMessages(roomId,0).then((res)=>{
 			if (res) {
 				let chatMsgArray = [];
 				res.forEach((chatMsg)=>{
 					chatMsg.createdAt = new Date(chatMsg.createdAt);
 					chatMsgArray.push(chatMsg);
 				})
 				this.roomChatList = chatMsgArray;
 				setTimeout(()=>{
 					this.ngZone.run(()=>{
 						this.roomChatList = chatMsgArray;
 					})
 					if (document.querySelector('.roomchat-content')) {
 						let element = document.querySelector('.roomchat-content').children[1];
 						if (element) {						
 							element.scrollTop = element.scrollHeight;
 						}
 					}						
 				},500);
 			}
 		});
 	}

 	sendGroupMsg(formMessage){
 		let roomId =  this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		this.messageService.sendGroupMessage(roomId, formMessage.text, 0).then(()=>{
 			this.formMessage = {};
 			this.getGroupMessage();
 		});
 	}

 	groupInfo(){
 		this.viewGroupList = true;
 		let roomId =  this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		this.roomService.getMemberInRoom(roomId).then((res)=>{
 			if (res) {
 				this.groupMemberList = res;
 				// get user list
 				this.getUserList();
 				// get user list end
 			}
 		});
 	}

 	// remove member
 	removeMember(memberInfo){
 		let roomId = this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		let memberId = memberInfo ? memberInfo.id : '';
 		this.roomService.deleteRoomMember(roomId,memberId).then((res)=>{
 			// splice Array
 			var index = this.groupMemberList.indexOf(memberInfo);
 			if (index > -1) {
 				this.groupMemberList.splice(index, 1);
 			}
 		});
 	}
 	// remove member end


 	// get remaining user list not present in group
 	getUserList(){
 		this.userService.loadUsers().then((userlist)=>{
 			console.log(userlist, 'user list');
 			this.groupMemberList.forEach((groupMember)=>{
 				userlist.forEach((list, index)=>{
 					if (list.id == groupMember.id) {
 						userlist.splice(index, 1);
 					}
 				})
 			});
 			console.log(userlist, 'list');
 			this.remaningUserList = userlist;
 		});
 	}
 	// get remaining user list not present in group end

 	// add members to group
 	addMemberGroup(){
 		let membersToAdd : any =[];
 		membersToAdd = this.selectedMemberList && this.selectedMemberList.length ?  this.selectedMemberList : [];
 		let roomId = this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		this.roomService.addMemberToGroup(membersToAdd, roomId).then((data)=>{
 			console.log(data, 'data');
 			this.selectedMemberList = [];
 			if (data) {
 				data.forEach((member)=>{
 					if (member) {
 						this.groupMemberList.push(member);
 					}
 				})
 			}
 		});
 	}
 	// add members to group end


 	// select members to add to group
 	createMemList(member){
 		if (this.selectedMemberList.length) {
 			this.currentIndex = this.selectedMemberList.indexOf(member);
 		}
 		if (this.currentIndex !== -1 ) {
 			this.selectedMemberList.splice(this.currentIndex, 1);
 		}else {
 			this.selectedMemberList.push(member);
 		}
 	}
 	// select members to add to group end

 }
