import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthUser, RoomDetail } from '../../providers/entities/entities';
import { MessageServiceProvider } from '../message-service/message-service'
import { Observable } from 'rxjs';
import * as Enumerable from "linq"; 
import { UserServiceProvider } from '../user-service/user-service'



@Injectable()
export class RoomserviceProvider {
	roomPath: any;
	userListPath: any;
	roomMessagePath: any;
	constructor(public http: HttpClient, public User: AuthUser, public messageService: MessageServiceProvider, public userService: UserServiceProvider, public roomDetail: RoomDetail) {
		console.log('Hello RoomserviceProvider Provider');
		this.roomPath =  firebase.database().ref().child('room-wala');
		this.userListPath = firebase.database().ref().child('userList');
		this.roomMessagePath = firebase.database().ref().child('roomwala-msg')
	}


	// listener for group

	setupGroupAddedListener(): Promise<any>{
		let groupList : any = [];
		let promise = new Promise((resolve, reject)=>{
			return this.userListPath.child(this.User.id).on('child_added', (snapShot)=>{
				let conversation = this.mappedUserGroupData(snapShot);
				if (conversation) {
					groupList.push(conversation);
					resolve(groupList);
				}
			})
		});
		return promise;
	}

	// listener for group end


	createRoom(roomDetail, roomMemberList){
		let userData = {
			email: this.User.email,
			id: this.User.id,
			name: this.User.name,
			status: true,
			uid: this.User.uid,
		} 
		roomMemberList.push(userData);


		let modifiedMemberList = [];
		let idKey = this.roomPath.push().key;
		let roomInfo = {
			private: false,
			name: roomDetail.name,
			role: 'owner',
			uid: this.User.id,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			last_message:'',
			last_message_time:firebase.database.ServerValue.TIMESTAMP,
		}
		return this.roomPath.child(idKey).set(roomInfo).then(()=>{
			roomMemberList.forEach(members=>{
				var memberApplicant = {
					displayName: roomDetail.name,
					role: 'member',
					uid: members.id,
					createdAt: firebase.database.ServerValue.TIMESTAMP
				};
				if (members.id == this.User.id) {
					memberApplicant.role = 'owner';
				};
				modifiedMemberList.push(memberApplicant);	
				modifiedMemberList.forEach((newMember)=>{
					this.userListPath.child(newMember.uid).child(idKey).set(newMember).then(()=>{
						this.roomPath.child(idKey).child(newMember.uid).set(newMember);
					})
				})			
			});
			this.messageService.get(idKey).then(()=>{
				let defaultmessge = 'Group created';
				this.messageService.sendGroupMessage(idKey,defaultmessge, '');
			})
		});
	}


	deleteRoom(roomId){
		// this.getMemberRole.then((res)=>{

			// })
			let query = this.userListPath.orderByKey().once('value');
			query.then((snapshot)=>{
				snapshot.forEach((childSnapShot)=>{
					let userId = childSnapShot.key;
					this.userListPath.child(userId).child(roomId).remove().then(data=>{
						this.roomPath.child(roomId).set(null).then(res=>{
							console.log(res, 'res room id is deleted');
						})
					})
				})
			})
		}

		deleteRoomMember(roomId, memberId): Promise<any>{
			let promise = new Promise((resolve, reject)=>{
				this.getMemberRole(roomId).then(memberRole=>{
					if (memberRole) {
						var query= this.roomPath.child(roomId).child(memberId);
						this.userListPath.child(memberId).child(roomId).off();

						query.remove().then((data)=> {
							this.userListPath.child(memberId).child(roomId).remove().then((data)=> {
								console.log('Delete User from Room::', data) ;
								resolve(data);
							});
						});

					}
				})
			});
			return promise;		
		}

		getMemberRole(roomId) : Promise<any>{
			let promise = new Promise((resolve, reject)=>{
				let query = this.roomPath.child(roomId).child(this.User.id).orderByChild('uid').once('value');
				return query.then((snapShot)=>{
					let returnVal : boolean;
					let data = snapShot.child('role').val();
					if (data == 'owner') {
						returnVal = true;
						// return data;
					}else{
						// return data;
					}
					resolve(returnVal);
				})
			});
			return promise;			
		}

		loadGroups() : Promise<any>{
			let roomList: any = [];
			let query = this.userListPath.orderByKey().equalTo(this.User.id).once('value');
			let newQuery = this.userListPath.orderByKey().equalTo(this.User.id);

			newQuery.once('value', (snap) => 
				console.log(snap.val(), 'value')
				);
			return Promise.all([query]).then((childSnapshot)=>{
				console.log(childSnapshot, 'childSnapshot');
			})
		}

		mappedUserGroupData(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			if(childData && childSnapshot.hasChildren()){
				var roomData={
					roomId:key,
					name:childData.displayName,
					displayName:childData.displayName,
					role:childData.role?childData.role:"unknown",
					last_message_content:childData.last_message?childData.last_message:'',
					type:'group',
					createdAt:childData.createdAt ? childData.createdAt : (new Date('1900-01-01')).valueOf(),
					displayDate:childData.createdAt,
					last_message_user:childData.last_message_user?childData.last_message_user:'',
					color:childData.color
				};
			}
			return roomData;   
		}



		// loadgroup with last conversation
		loadGroupsLastConv(): Promise<any>{
			let promise = new Promise((resolve,reject)=>{
				let roomList = [];
				if (this.User && this.User.id) {
					let query =  this.userListPath.orderByKey().equalTo(this.User.id).once('value');
					return query.then((childSnapShot)=>{
						childSnapShot.forEach((childSnapShot)=>{
							childSnapShot.forEach((childSnapShot)=>{
								let childData = this.mappedUserGroupData(childSnapShot);
								let roomMessageQuery = this.roomMessagePath.child(childSnapShot.key).limitToLast(1).once('value');
								roomMessageQuery.then((childSSMessage)=>{
									console.log(childSSMessage.val());
									let message =  Enumerable.from(childSSMessage.val()).select(x=>x.value).firstOrDefault();
									if (message) {
										childData.last_message_content =  message.content;
										childData.last_message_user =  message.sender_email;
										childData.createdAt =  message.createdAt;
										roomList.push(childData);
										console.log(roomList, 'room list');									
									}
									resolve(roomList);
								})
							})						
						})
					})
				}
			});
			return promise;
		}
		// loadgroup with last conversation end

		// get members in room
		getMemberInRoom(roomId) :Promise<any>{
			let groupMemberList = [];
			let count = 0;
			let promise =  new Promise((resolve, reject)=>{
				let query = this.roomPath.child(roomId).once('value');
				return this.userService.loadUsers().then((userData)=>{
					if (userData) {
						return query.then((snapShot)=>{
							let roomDetails = snapShot.val();
							roomDetails = Object.keys(roomDetails).map(key=>{
								if (roomDetails[key] && roomDetails[key].role) {
									return roomDetails[key];
								}
							});
							roomDetails = roomDetails.filter((list)=>{
								return list != undefined;
							});
							userData.forEach((userlist)=>{
								roomDetails.forEach((roomList)=>{
									if (userlist.id == roomList.uid) {
										userlist.role = roomList.role;
										userlist.roomList = [];
										groupMemberList.push(userlist);
									};
								})
							});
							resolve(groupMemberList);
							console.log(groupMemberList, 'user data');
						})
					}
				})
			});
			return promise;
		}
		// get members in room end

		// update a role in group 
		updateRole(roomId,groupUserId,role): Promise<any>{
			let promise = new Promise((resolve, reject)=>{
				return this.getMemberRole(roomId).then((memberRole)=>{
					if (memberRole) {
						var query = this.roomPath.child(roomId).child(groupUserId).update({role:role}).then((data)=> {
							this.userListPath.child(groupUserId).child(roomId).update({role:role}).then((data)=> {
								resolve(data);
							});
						});

					}
				})
			});
			return promise;			
		}
		// update a role in group  end

		// current room detail
		getRoomDetails(roomId): Promise<any>{
			let roomData = {};
			let promise = new Promise((resolve, reject)=>{
				let query = this.roomPath.child(roomId).orderByKey().once('value');
				return query.then((snapShot)=>{
					var key = snapShot.key;
					var childData = snapShot.val();
					if(childData) {
						roomData = {
							roomid:key,
							name:childData.name,
							createdAt:childData.createdAt,
							role:childData.role,
						};
						resolve(roomData);
					}
				})
			});
			return promise;
		}
		// current room detail end

		// update group name 
		updateGroupName(roomId,title){
			if (roomId && title) {
				let query = this.roomPath.child(roomId).update({name: title});
				return query;
			}
		};
		// update group name end


		addMemberToGroup(membersToAdd, roomId) : Promise<any>{
			let promise = new Promise((resolve,reject)=>{
				let addedGroupMemList : any = [];
				membersToAdd.forEach((member)=>{
					let userQuery = this.userListPath.child(member.id).child(roomId);
					let memberApplicant = {
						nickname: member.email ? member.email : member.name,
						displayName: this.roomDetail ? this.roomDetail.name : '',
						role: 'member',
						uid: member.id,
						createdAt: firebase.database.ServerValue.TIMESTAMP,
					};

					userQuery.on('value', (snapData) => {
						if (snapData.val() == null) {
							userQuery.set(memberApplicant);
						}
					});

					let roomQuery = this.roomPath.child(roomId).child(member.id);
					roomQuery.on('value', (snapData1) =>{
						if (snapData1.val() == null) {
							roomQuery.set(memberApplicant);
							if (this.User.id !== member.id) {
								member.role = 'member';
								addedGroupMemList.push(member);
								if (addedGroupMemList && addedGroupMemList.length >= membersToAdd.length ) {
									resolve(addedGroupMemList);
								}
							}
						}
					});
				});
				
			});
			return promise;			
		}

	}
