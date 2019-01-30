var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthUser } from '../../providers/entities/entities';
import { MessageServiceProvider } from '../message-service/message-service';
var RoomserviceProvider = /** @class */ (function () {
    function RoomserviceProvider(http, User, messageService) {
        this.http = http;
        this.User = User;
        this.messageService = messageService;
        console.log('Hello RoomserviceProvider Provider');
        this.roomPath = firebase.database().ref().child('room-wala');
        this.userListPath = firebase.database().ref().child('userList');
        this.roomMessagePath = firebase.database().ref().child('roomwala-msg');
    }
    // listener for group
    RoomserviceProvider.prototype.setupGroupAddedListener = function () {
        var _this = this;
        var groupList = [];
        var promise = new Promise(function (resolve, reject) {
            return _this.userListPath.child(_this.User.id).on('child_added', function (snapShot) {
                var conversation = _this.mappedUserGroupData(snapShot);
                if (conversation) {
                    groupList.push(conversation);
                    resolve(groupList);
                }
            });
        });
        return promise;
    };
    // listener for group end
    RoomserviceProvider.prototype.createRoom = function (roomDetail, roomMemberList) {
        var _this = this;
        var userData = {
            email: this.User.email,
            id: this.User.id,
            name: this.User.name,
            status: true,
            uid: this.User.uid,
        };
        roomMemberList.push(userData);
        var modifiedMemberList = [];
        var idKey = this.roomPath.push().key;
        var roomInfo = {
            private: false,
            name: roomDetail.name,
            role: 'owner',
            uid: this.User.id,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            last_message: '',
            last_message_time: firebase.database.ServerValue.TIMESTAMP,
        };
        return this.roomPath.child(idKey).set(roomInfo).then(function () {
            roomMemberList.forEach(function (members) {
                var memberApplicant = {
                    displayName: roomDetail.name,
                    role: 'member',
                    uid: members.id,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                };
                if (members.id == _this.User.id) {
                    memberApplicant.role = 'owner';
                }
                ;
                modifiedMemberList.push(memberApplicant);
                modifiedMemberList.forEach(function (newMember) {
                    _this.userListPath.child(newMember.uid).child(idKey).set(newMember).then(function () {
                        _this.roomPath.child(idKey).child(newMember.uid).set(newMember);
                    });
                });
            });
            _this.messageService.get(idKey).then(function () {
                var defaultmessge = 'Group created';
                _this.messageService.sendGroupMessage(idKey, defaultmessge, '');
            });
        });
    };
    RoomserviceProvider.prototype.deleteRoom = function () {
    };
    RoomserviceProvider.prototype.deleteRoomMember = function () {
    };
    RoomserviceProvider.prototype.loadGroups = function () {
        var roomList = [];
        var query = this.userListPath.orderByKey().equalTo(this.User.id).once('value');
        var newQuery = this.userListPath.orderByKey().equalTo(this.User.id);
        newQuery.once('value', function (snap) {
            return console.log(snap.val(), 'value');
        });
        return Promise.all([query]).then(function (childSnapshot) {
            console.log(childSnapshot, 'childSnapshot');
        });
    };
    RoomserviceProvider.prototype.mappedUserGroupData = function (childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData && childSnapshot.hasChildren()) {
            var roomData = {
                roomid: key,
                name: childData.displayName,
                displayName: childData.displayName,
                role: childData.role ? childData.role : "unknown",
                last_message_content: childData.last_message ? childData.last_message : '',
                type: 'group',
                createdAt: childData.createdAt ? childData.createdAt : (new Date('1900-01-01')).valueOf(),
                displayDate: childData.createdAt,
                last_message_user: childData.last_message_user ? childData.last_message_user : '',
                color: childData.color
            };
        }
        return roomData;
    };
    // loadgroup with last conversation
    RoomserviceProvider.prototype.loadGroupsLastConv = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (_this.User && _this.User.id) {
                var query = _this.userListPath.orderByKey().equalTo(_this.User.id).once('value');
                return query.then(function (childSnapShot) {
                    childSnapShot.forEach(function (childSnapShot) {
                        // let childData = this.mappedUserGroupData(childSS);
                        // let roomMessageQuery = this.roomMessagePath.child(childSS.key).once('value');
                        // roomMessageQuery.then((childSSMessage)=>{
                        // 	console.log(Object.keys(childSSMessage));
                        // 	let message =  Enumerable.from(childSSMessage).select(x=>x.value).firstOrDefault();
                        // 	console.log(message, 'message');
                        // })
                    });
                });
            }
        });
        return promise;
    };
    RoomserviceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, AuthUser, MessageServiceProvider])
    ], RoomserviceProvider);
    return RoomserviceProvider;
}());
export { RoomserviceProvider };
//# sourceMappingURL=roomservice.js.map