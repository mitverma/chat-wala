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
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { AuthUser } from '../../providers/entities/entities';
/**
 * Generated class for the RoomChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RoomChatPage = /** @class */ (function () {
    function RoomChatPage(navCtrl, navParams, messageService, User, events, ngZone) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.messageService = messageService;
        this.User = User;
        this.events = events;
        this.ngZone = ngZone;
        this.roomChatList = [];
        this.formMessage = {};
    }
    RoomChatPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad RoomChatPage');
        this.messageService.setUpGroupMessageListiner().then(function (res) {
            if (res && res.length) {
                _this.getGroupMessage();
            }
        });
        this.events.subscribe('groupMessage:Added', function (groupMsg) {
            if (groupMsg) {
                _this.getGroupMessage();
            }
        });
    };
    RoomChatPage.prototype.getGroupMessage = function () {
        var _this = this;
        this.messageService.bindGroupMessages('-LWp2j8UJK5fYe0bBWyr', 0).then(function (res) {
            if (res) {
                var chatMsgArray_1 = [];
                res.forEach(function (chatMsg) {
                    chatMsg.createdAt = new Date(chatMsg.createdAt);
                    chatMsgArray_1.push(chatMsg);
                });
                _this.roomChatList = chatMsgArray_1;
                setTimeout(function () {
                    _this.ngZone.run(function () {
                        _this.roomChatList = chatMsgArray_1;
                    });
                    if (document.querySelector('.roomchat-content')) {
                        var element = document.querySelector('.roomchat-content').children[1];
                        if (element) {
                            element.scrollTop = element.scrollHeight;
                        }
                    }
                }, 500);
            }
        });
    };
    RoomChatPage.prototype.sendGroupMsg = function (formMessage) {
        var _this = this;
        this.messageService.sendGroupMessage('-LWp2j8UJK5fYe0bBWyr', formMessage.text, 0).then(function () {
            _this.formMessage = {};
            _this.getGroupMessage();
        });
    };
    RoomChatPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-room-chat',
            templateUrl: 'room-chat.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, MessageServiceProvider, AuthUser, Events, NgZone])
    ], RoomChatPage);
    return RoomChatPage;
}());
export { RoomChatPage };
//# sourceMappingURL=room-chat.js.map