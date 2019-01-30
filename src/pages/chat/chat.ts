import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthUser } from '../../providers/entities/entities';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html',
})
export class ChatPage {
	conversationPath: any;
	toUserData: any = {};
	formMessage:  Object = {};
	chatList: any = [];
	constructor(public navCtrl: NavController, public navParams: NavParams, public User: AuthUser, public messageService: MessageServiceProvider, public events: Events, public ngZone: NgZone) {
		this.conversationPath = firebase.database().ref().child('conversation-chat');
		if (this.navParams.data) {			
			this.toUserData = this.navParams.data;
		}
		this.events.subscribe('userChat:Added', (chatLastData)=>{
			if (chatLastData && chatLastData.conversations_id) {
				// console.log(chatLastData);
				this.toUserData.to_user_id = chatLastData.to_user_id;
				// this.chatList.push(chatLastData);
				this.getUserMessage();
			}
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ChatPage');
		console.log(this.toUserData, 'to user data');
		this.getUserMessage();
	}

	sendMessageToUser(messageDetail){
		let setMessageData = {
			text: messageDetail.text,
			from_username: this.User.name,
			from_userId: this.User.id,
			to_user_id: this.toUserData.id,
		}
		this.messageService.sendMessageToUser(setMessageData).then(()=>{
			this.formMessage = {};
			this.getUserMessage(); // i used this bcoz limitTolast not working
		});
	}

	getUserMessage(){
		if (this.toUserData) {
			this.messageService.bindUserMessages(this.User.id, this.toUserData.id, 20).subscribe((messageList: any)=>{
				if (messageList && messageList.length) {
					console.log(messageList, 'msg');
					this.chatList = messageList;
					setTimeout(()=>{
						this.ngZone.run(()=>{
							this.chatList = messageList;
						})
						if (document.querySelector('.chat-content')) {
							let element = document.querySelector('.chat-content').children[1];
							if (element) {						
								element.scrollTop = element.scrollHeight;
							}
						}						
					},500);
					
				}
			});		
		}
	}

}

