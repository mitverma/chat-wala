import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthUser } from '../../providers/entities/entities';
import { Observable } from 'rxjs';
import { DevicestorageProvider } from '../../providers/devicestorage/devicestorage';
import { MessageServiceProvider } from '../../providers/message-service/message-service'


@Injectable()
export class UserServiceProvider {

	userListPath: any;
	dbReference: any;
	conversationPath:any;
	constructor(public http: HttpClient, public User: AuthUser, public deviceStorage: DevicestorageProvider, public messageService: MessageServiceProvider, public events: Events) {
		console.log('Hello UserServiceProvider Provider');
		this.dbReference = firebase.database().ref();
		this.userListPath = firebase.database().ref().child('userList');
		this.conversationPath = firebase.database().ref().child('conversation-chat');
	}


	setToUserList(setUser){
		let setUserDetail = {
			uid : setUser.uid,
			name :  setUser.name,
			email :  setUser.email,
			deviceToken :  '',
			status :  true,
		}
		let idKey = this.userListPath.push().key;
		this.userListPath.child(idKey).set(setUserDetail);

		setUser.id = idKey;

		// assig auth user

		Object.assign(this.User, setUser);
		// device storage
		return this.deviceStorage.setValue(this.User.auth_token, this.User).then((user) => {
			return user ? user : this.User;
		}).catch(() => {
			return null;
		}); 
		// device storage end

		// assig auth user end

	}

	updateUserList(){

	}

	getUserList() : Observable<any[]>{
		let list: any = [];
		return new Observable(observer => {
			this.dbReference.on('value', (snapshot)=>{
				let getList = snapshot.val();
				list =  Object.keys(getList.userList).map((key)=>{
					if ((this.User && this.User.uid) !== (getList.userList[key] && getList.userList[key].uid)) {
						getList.userList[key].id = key;
						return getList.userList[key];
					}
				});
				return list;
			})
			observer.next(list);
			observer.complete();
		});
	}
	UsersUpdateventListener(){
		this.userListPath.on('child_added',function(Snapshot) {
			console.log(Snapshot.val(), 'Snapshot');
			// onUpdate(userdata);
		});  
	}

	UserMessageListiner(){
		let getList: any;
		this.conversationPath.on('child_added', (snapshot)=>{
			if (snapshot) {
				console.log(snapshot.val(), 'snapshot');
				let  lastUpdatedChat = snapshot.val();
				if (lastUpdatedChat) {
					this.events.publish('userChat:Added', lastUpdatedChat);
				}
			}
		}, error=>{
			console.log(error);
		})

		// return new Observable(observer => {
			// 	this.conversationPath.on('child_added', (snapshot)=>{
				// 		getList = snapshot.val();
				// 		return getList;
				// 	})
				// 	observer.next(getList);
				// 	observer.complete();
				// });

			}

			UsersAddEventListener(): Promise<any>{
				let userList: any = [];
				let promise = new Promise((resolve, reject)=>{
					return this.userListPath.on('child_added', (snapShot)=>{
						if (snapShot) {
							let userData = this.mappedUserData(snapShot, {});
							if (userData) {
								userList.push(userData);
								resolve(userList);
							}
						}
					})
				})
				return promise;
			}

			mappedUserData(childSnapshot,roomList){ 
				let  key=childSnapshot.key;
				let  childData=childSnapshot.val();
				let  userData={
					id:'',
					name:'',
					email:'',
					displayName:'',
					uid:'',
					last_message_content:'',
					type:'user',
					role:'',
					roomList: roomList,
					createdAt:(new Date('1900 01 01')).valueOf(),
					displayDate:"",
					last_message_user:'',
					color:"",
					connected:"",
					lastseen:"",
				};
				if (childData) {
					userData = {
						id:key,
						name:childData.name ? childData.name : childData.email,
						email:childData.email,
						displayName:childData.displayName,
						uid:childData.uid,
						last_message_content:'',
						type:'user',
						role:'',
						roomList: roomList,
						createdAt:(new Date('1900 01 01')).valueOf(),
						displayDate:"",
						last_message_user: childData.last_message_user ?childData.last_message_user: '',
						color:childData.color,
						connected:childData.connected,
						lastseen: '',
					};
				}
				return userData;
			};

			// get user list
			loadUserList(): Promise<any>{
				let userList: any = [];
				let promise = new Promise((resolve, reject)=>{
					if (this.User && this.User.id) {
						let query =  this.userListPath.orderByChild('status').equalTo(true).once('value');
						return query.then((snapShot)=>{
							if (snapShot) {
								snapShot.forEach((childSnapShot)=>{
									let userData = this.mappedUserData(childSnapShot, []);
									if (userData) {
										userList.push(userData);
										// return userList;
									}
									resolve(userList);
								})
							}
						})
					}
				});
				return promise;
			}
			// get user list end

			loadUsersListAddEventListener(): Promise<any>{
				let conversationList: any = [];
				let promise = new Promise((resolve, reject)=>{
					let query = this.conversationPath.orderByChild('from_userId').equalTo(this.User.id).limitToLast(1);
					return query.on('child_added', (snapShot)=>{
						if (snapShot) {
							let conversation = snapShot.val();
							conversationList.push(conversation);
						}
						resolve(conversationList);
					})
				})
				
				return promise;
			}

			// load Users
			loadUsers(): Promise<any> {
				let promise = new Promise((resolve, reject)=>{
					let roomList = [];
					let usersList = [];
					let query = this.userListPath.orderByChild('status').equalTo(true).once('value');
					return query.then((snapShot)=>{
						if (snapShot) {
							snapShot.forEach((childSnapShot)=>{
								let key = childSnapShot.key;
								childSnapShot.forEach((roomData)=>{
									let roomKey = roomData.key;
									let roomDetailObj = {
										roomId: roomKey
									}
									roomList.push(roomDetailObj);
								});
								let userData = this.mappedUserData(childSnapShot, roomList);
								if (userData) {
									usersList.push(userData);
									resolve(usersList);
								}
							});
						}
					})
				})
				return promise;				
			};
			// load Users end


			// get connectivity list
			trackPresence() {
				let connectedRef = this.dbReference.child('/.info/connected');
				let myConnectionsRef = this.dbReference.child('/users/' + this.User.id + '/connected');
				let lastOnlineRef  = this.dbReference.child('/users/' + this.User.id + '/lastseen');
				connectedRef.on('value', function (isOnline) {
					if (isOnline.val() === true) {
						myConnectionsRef.set(true);  
						myConnectionsRef.onDisconnect().remove();
						lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
					}
					else{
						myConnectionsRef.set(false); 
					}
					console.info('Presence::',isOnline);
				});
			};
			// get connectivity list end

		}
