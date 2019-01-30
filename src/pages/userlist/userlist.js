var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthProvider } from '../../providers/auth/auth';
import { RoomserviceProvider } from '../../providers/roomservice/roomservice';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
/**
 * Generated class for the UserlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var UserlistPage = /** @class */ (function () {
    function UserlistPage(navCtrl, navParams, userService, authService, roomService, alertCtrl, messageService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.authService = authService;
        this.roomService = roomService;
        this.alertCtrl = alertCtrl;
        this.messageService = messageService;
        this.currentIndex = -1;
        this.userList = [];
        this.selectedList = [];
    }
    UserlistPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.authService.ensureAuthenticate().then(function (user) {
            _this.getUserList();
            _this.userService.UserMessageListiner();
        });
    };
    UserlistPage.prototype.getUserList = function () {
        var _this = this;
        this.userService.getUserList().subscribe(function (res) {
            if (res && res.length) {
                console.log(res, 'response');
                _this.userList = res.filter(function (val) {
                    return val !== undefined;
                });
                _this.searchUserList = _this.userList;
            }
        });
    };
    UserlistPage.prototype.createRoomList = function (userValue) {
        console.log(userValue);
        if (this.selectedList.length) {
            this.currentIndex = this.selectedList.indexOf(userValue);
        }
        if (this.currentIndex !== -1) {
            this.selectedList.splice(this.currentIndex, 1);
        }
        else {
            this.selectedList.push(userValue);
        }
        this.currentIndex = -1;
    };
    UserlistPage.prototype.getItems = function (event) {
        var val = event.target.value;
        if (val && val.trim() != '') {
            this.userList = this.searchUserList.filter(function (item) {
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
        else {
            this.userList = this.searchUserList;
        }
    };
    UserlistPage.prototype.createNewRoom = function (roomName) {
        var roomDetail = {
            name: roomName,
        };
        this.roomService.createRoom(roomDetail, this.selectedList).then(function (user) {
        });
    };
    UserlistPage.prototype.setGroupNameAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
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
                    handler: function () {
                    }
                },
                {
                    text: 'Create',
                    handler: function (data) {
                        var roomName = data && data.groupname ? data.groupname : 'testing';
                        _this.createNewRoom(roomName);
                    }
                }
            ]
        });
        alert.present();
    };
    UserlistPage.prototype.chatToUser = function (userData) {
        this.navCtrl.push('ChatPage', userData);
    };
    UserlistPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-userlist',
            templateUrl: 'userlist.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, UserServiceProvider, AuthProvider, RoomserviceProvider, AlertController, MessageServiceProvider])
    ], UserlistPage);
    return UserlistPage;
}());
export { UserlistPage };
//# sourceMappingURL=userlist.js.map