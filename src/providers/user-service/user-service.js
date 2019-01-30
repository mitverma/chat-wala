var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthUser } from '../../providers/entities/entities';
import { Observable } from 'rxjs';
import { DevicestorageProvider } from '../../providers/devicestorage/devicestorage';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
var UserServiceProvider = /** @class */ (function () {
    function UserServiceProvider(http, User, deviceStorage, messageService, events) {
        this.http = http;
        this.User = User;
        this.deviceStorage = deviceStorage;
        this.messageService = messageService;
        this.events = events;
        console.log('Hello UserServiceProvider Provider');
        this.dbReference = firebase.database().ref();
        this.userListPath = firebase.database().ref().child('userList');
        this.conversationPath = firebase.database().ref().child('conversation-chat');
    }
    UserServiceProvider.prototype.setToUserList = function (setUser) {
        var _this = this;
        var setUserDetail = {
            uid: setUser.uid,
            name: setUser.name,
            email: setUser.email,
            deviceToken: '',
            status: true,
        };
        var idKey = this.userListPath.push().key;
        this.userListPath.child(idKey).set(setUserDetail);
        setUser.id = idKey;
        // assig auth user
        Object.assign(this.User, setUser);
        // device storage
        return this.deviceStorage.setValue(this.User.auth_token, this.User).then(function (user) {
            return user ? user : _this.User;
        }).catch(function () {
            return null;
        });
        // device storage end
        // assig auth user end
    };
    UserServiceProvider.prototype.updateUserList = function () {
    };
    UserServiceProvider.prototype.getUserList = function () {
        var _this = this;
        var list = [];
        return new Observable(function (observer) {
            _this.dbReference.on('value', function (snapshot) {
                var getList = snapshot.val();
                list = Object.keys(getList.userList).map(function (key) {
                    if ((_this.User && _this.User.uid) !== (getList.userList[key] && getList.userList[key].uid)) {
                        getList.userList[key].id = key;
                        return getList.userList[key];
                    }
                });
                return list;
            });
            observer.next(list);
            observer.complete();
        });
    };
    UserServiceProvider.prototype.UsersUpdateventListener = function () {
        this.userListPath.on('child_added', function (Snapshot) {
            console.log(Snapshot.val(), 'Snapshot');
            // onUpdate(userdata);
        });
    };
    UserServiceProvider.prototype.UserMessageListiner = function () {
        var _this = this;
        var getList;
        this.conversationPath.on('child_added', function (snapshot) {
            if (snapshot) {
                console.log(snapshot.val(), 'snapshot');
                var lastUpdatedChat = snapshot.val();
                if (lastUpdatedChat) {
                    _this.events.publish('userChat:Added', lastUpdatedChat);
                }
            }
        }, function (error) {
            console.log(error);
        });
        // return new Observable(observer => {
        // 	this.conversationPath.on('child_added', (snapshot)=>{
        // 		getList = snapshot.val();
        // 		return getList;
        // 	})
        // 	observer.next(getList);
        // 	observer.complete();
        // });
    };
    UserServiceProvider.prototype.UsersAddEventListener = function () {
        var _this = this;
        var userList = [];
        var promise = new Promise(function (resolve, reject) {
            return _this.userListPath.on('child_added', function (snapShot) {
                if (snapShot) {
                    var userData = _this.mappedUserData(snapShot, {});
                    if (userData) {
                        userList.push(userData);
                        resolve(userList);
                    }
                }
            });
        });
        return promise;
    };
    UserServiceProvider.prototype.mappedUserData = function (childSnapshot, roomList) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        var userData = {
            id: '',
            name: '',
            email: '',
            displayName: '',
            uid: '',
            last_message_content: '',
            type: 'user',
            role: '',
            roomList: roomList,
            createdAt: (new Date('1900 01 01')).valueOf(),
            displayDate: "",
            last_message_user: '',
            color: "",
            connected: "",
            lastseen: "",
        };
        if (childData) {
            userData = {
                id: key,
                name: childData.name ? childData.name : childData.email,
                email: childData.email,
                displayName: childData.displayName,
                uid: childData.uid,
                last_message_content: '',
                type: 'user',
                role: '',
                roomList: roomList,
                createdAt: (new Date('1900 01 01')).valueOf(),
                displayDate: "",
                last_message_user: childData.last_message_user ? childData.last_message_user : '',
                color: childData.color,
                connected: childData.connected,
                lastseen: '',
            };
        }
        return userData;
    };
    ;
    UserServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, AuthUser, DevicestorageProvider, MessageServiceProvider, Events])
    ], UserServiceProvider);
    return UserServiceProvider;
}());
export { UserServiceProvider };
//# sourceMappingURL=user-service.js.map