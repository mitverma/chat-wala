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
import { Observable } from 'rxjs';
import { AuthUser } from '../../providers/entities/entities';
/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
var MessageServiceProvider = /** @class */ (function () {
    function MessageServiceProvider(http, User, events) {
        this.http = http;
        this.User = User;
        this.events = events;
        console.log('Hello MessageServiceProvider Provider');
        this.dbRef = firebase.database().ref();
        this.roomPath = firebase.database().ref().child('room-wala');
        this.roomMessagePath = firebase.database().ref().child('roomwala-msg');
        this.conversationPath = firebase.database().ref().child('conversation-chat');
    }
    MessageServiceProvider.prototype.getRoomMessage = function () {
    };
    MessageServiceProvider.prototype.get = function (roomId) {
        if (roomId) {
            var message_1;
            var groupMessageQuery = this.dbRef.child('roomwala-msg').child(roomId).orderByChild('createdAt');
            var query = groupMessageQuery.limitToLast(20).once('value');
            return Promise.all([query]).then(function (snapShot) {
                snapShot[0].forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    if (childData)
                        var messageObj = {
                            id: key,
                            sender_userid: childData.sender_userid,
                            sender_username: childData.sender_username,
                            createdAt: childData.createdAt,
                            content: childData.content,
                        };
                    message_1.push(messageObj);
                });
                return message_1;
            });
        }
    };
    ;
    // group message
    MessageServiceProvider.prototype.sendGroupMessage = function (roomid, message, title) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var chatMessage = {
                from: _this.User.id,
                sender_username: _this.User.name ? _this.User.name : _this.User.email,
                sender_email: _this.User.email,
                sender_userid: _this.User.id,
                content: message,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                read: false,
            };
            var query = _this.roomMessagePath.child(roomid);
            var messageIdKey = query.push().key;
            return query.child(messageIdKey).set(chatMessage).then(function (res) {
                console.log(res, 'res');
                resolve();
                // set last message of group
                _this.updateGroupLastMessage(roomid, chatMessage);
                // set last message of group end
            });
            // send data to Notification from here
            // let messageNotification = {
            //   text:chatMessage.content,  
            //   notificationTitle: title,
            //   click_action:'app.groupchat',
            //   params:
            //   {
            //     'roomId': roomid,
            //   }
            // };
            // call Notification
            // call Notification end
            // send data to Notification from here end
        });
        return promise;
    };
    // group message end
    MessageServiceProvider.prototype.sendMessageToUser = function (messageData) {
        console.log(messageData, 'mess');
        var setMsg = {
            conversations_id: messageData.from_userId + '@@' + messageData.to_user_id,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            notificationTitle: messageData.from_username,
            text: messageData.text,
            from_userId: messageData.from_userId,
            from_username: messageData.from_username,
            to_user_id: messageData.to_user_id,
        };
        // if  userid is > then to_userid
        if (messageData.from_userId > messageData.to_user_id) {
            setMsg.conversations_id = messageData.to_user_id + '@@' + messageData.from_userId;
        }
        // if  userid is > then to_userid end
        var newmessageidKey = this.conversationPath.push().key;
        return this.conversationPath.child(newmessageidKey).set(setMsg).then(function (val) {
            return val;
        });
    };
    MessageServiceProvider.prototype.bindUserMessages = function (userId, toUserId, lastPageId) {
        var _a;
        var messageList = [];
        if (userId && toUserId) {
            var index = lastPageId <= 0 ? 20 : lastPageId;
            if (userId > toUserId) {
                _a = [toUserId, userId], userId = _a[0], toUserId = _a[1];
            }
            var query = this.conversationPath.orderByChild('conversations_id').equalTo(userId + '@@' + toUserId);
            var getUserQuery_1 = query.once('value');
            return new Observable(function (observer) {
                Promise.all([getUserQuery_1]).then(function (snapShot) {
                    snapShot[0].forEach(function (childSnapshot) {
                        var key = childSnapshot.key;
                        var childData = childSnapshot.val();
                        if (childData)
                            var messageObj = {
                                id: key,
                                to_user_id: childData.to_user_id,
                                from_userId: childData.from_userId,
                                text: childData.text,
                                timestamp: new Date(childData.timestamp),
                                conversations_id: childData.conversations_id,
                            };
                        messageList.push(messageObj);
                        console.log(messageList, 'message list');
                        observer.next(messageList);
                        observer.complete();
                    });
                });
            });
        }
    };
    ;
    MessageServiceProvider.prototype.bindUserMessagesAddedEvent = function (userId, toUserId, lastPageId) {
        var messageList = {};
        if (userId && toUserId) {
            var query = this.conversationPath.orderByChild('conversations_id').equalTo(userId + '@@' + toUserId);
            // query.on('child_added', (snapShot)=>{
            query.limitToList(1).on('child_added', function (snapShot) {
                var key = snapShot.key;
                var childData = snapShot.val();
                if (childData) {
                    var messageObj = {
                        id: key,
                        to_user_id: childData.to_user_id,
                        text: childData.text,
                        timestamp: childData.timestamp,
                        conversations_id: childData.conversations_id,
                    };
                    messageList = messageObj;
                    console.log(messageList, 'assignes values', messageObj, 'message obj');
                }
            });
        }
    };
    ;
    // group
    MessageServiceProvider.prototype.bindGroupMessages = function (roomId, lastPageId) {
        var _this = this;
        var groupMessageList = [];
        var promise = new Promise(function (resolve, reject) {
            if (roomId) {
                var query = void 0;
                // if (lastPageId == '0') {
                //   query = this.roomMessagePath.child(roomId).orderByKey().limitToLast(lastPageId).once('value');
                // }else {
                //   query = this.roomMessagePath.child(roomId).orderByKey().limitToLast(lastPageId).endAt().once('value');
                // }
                query = _this.roomMessagePath.child(roomId).orderByKey().once('value');
                return query.then(function (Snapshot) {
                    console.log(Snapshot, 'ss');
                    Snapshot.forEach(function (childSnapshot) {
                        var childGroupMsg = _this.onChildGroupMessageLoaded(childSnapshot);
                        if (childGroupMsg) {
                            groupMessageList.push(childGroupMsg);
                            console.log(groupMessageList, 'group msg list');
                            resolve(groupMessageList);
                        }
                    });
                });
            }
        });
        return promise;
    };
    MessageServiceProvider.prototype.onChildGroupMessageLoaded = function (Snapshot) {
        var key = Snapshot.key;
        var childData = Snapshot.val();
        if (childData)
            var messageObj = {
                id: key,
                sender_userid: childData.sender_userid,
                sender_username: childData.sender_username,
                sender_email: childData.sender_email,
                createdAt: childData.createdAt,
                content: childData.content,
            };
        // message.push(messageObj);
        return messageObj;
    };
    ;
    // group message listener
    MessageServiceProvider.prototype.setUpGroupMessageListiner = function () {
        var _this = this;
        var messageList = [];
        var promise = new Promise(function (resolve, reject) {
            var roomId = '-LWp2j8UJK5fYe0bBWyr';
            var query = _this.roomMessagePath.child(roomId).orderByKey();
            return query.on('child_added', function (snapShot) {
                if (snapShot) {
                    var newMsg = _this.onChildGroupMessageAdded(snapShot);
                    if (newMsg) {
                        messageList.push(newMsg);
                        resolve(newMsg);
                        _this.events.publish('groupMessage:Added', newMsg);
                    }
                }
            });
        });
        return promise;
    };
    MessageServiceProvider.prototype.onChildGroupMessageAdded = function (Snapshot) {
        var key = Snapshot.key;
        var childData = Snapshot.val();
        if (childData)
            var messageObj = {
                id: key,
                sender_userid: childData.sender_userid,
                sender_username: childData.sender_username,
                createdAt: childData.createdAt,
                content: childData.content,
            };
        return (messageObj);
    };
    ;
    // group message listener end
    // set last message to group
    MessageServiceProvider.prototype.updateGroupLastMessage = function (roomId, data) {
        var updateGroupData = {
            last_message: data.content,
            last_message_time: data.createdAt,
            last_message_user: this.User.email
        };
        this.roomPath.child(roomId).update(updateGroupData);
    };
    MessageServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, AuthUser, Events])
    ], MessageServiceProvider);
    return MessageServiceProvider;
}());
export { MessageServiceProvider };
//# sourceMappingURL=message-service.js.map