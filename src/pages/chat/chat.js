var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthUser } from '../../providers/entities/entities';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
var ChatPage = /** @class */ (function () {
    function ChatPage(navCtrl, navParams, User, messageService, events, ngZone) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.User = User;
        this.messageService = messageService;
        this.events = events;
        this.ngZone = ngZone;
        this.formMessage = {};
        this.chatList = [];
        this.conversationPath = firebase.database().ref().child('conversation-chat');
        this.toUserData = this.navParams.data;
        this.events.subscribe('userChat:Added', function (chatLastData) {
            if (chatLastData && chatLastData.conversations_id) {
                // console.log(chatLastData);
                _this.toUserData.to_user_id = chatLastData.to_user_id;
                // this.chatList.push(chatLastData);
                _this.getUserMessage();
            }
        });
    }
    ChatPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ChatPage');
        console.log(this.toUserData, 'to user data');
        this.getUserMessage();
    };
    ChatPage.prototype.sendMessageToUser = function (messageDetail) {
        var _this = this;
        var setMessageData = {
            text: messageDetail.text,
            from_username: this.User.name,
            from_userId: this.User.id,
            to_user_id: this.toUserData.id,
        };
        this.messageService.sendMessageToUser(setMessageData).then(function () {
            _this.formMessage = {};
            _this.getUserMessage(); // i used this bcoz limitTolast not working
        });
    };
    ChatPage.prototype.getUserMessage = function () {
        var _this = this;
        if (this.toUserData) {
            this.messageService.bindUserMessages(this.User.id, this.toUserData.id, 20).subscribe(function (messageList) {
                if (messageList && messageList.length) {
                    console.log(messageList, 'msg');
                    _this.chatList = messageList;
                    setTimeout(function () {
                        _this.ngZone.run(function () {
                            _this.chatList = messageList;
                        });
                        if (document.querySelector('.chat-content')) {
                            var element = document.querySelector('.chat-content').children[1];
                            if (element) {
                                element.scrollTop = element.scrollHeight;
                            }
                        }
                    }, 500);
                }
            });
        }
    };
    ChatPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chat',
            templateUrl: 'chat.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AuthUser, MessageServiceProvider, Events, NgZone])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.js.map