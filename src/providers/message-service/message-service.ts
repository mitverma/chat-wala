import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { AuthUser,RoomDetail } from '../../providers/entities/entities';
/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class MessageServiceProvider {
    conversationPath: any;
    roomMessagePath: any;
    roomPath: any;
    dbRef: any;
    constructor(public http: HttpClient,public User: AuthUser, public events: Events, public roomDetail: RoomDetail) {
      console.log('Hello MessageServiceProvider Provider');
      this.dbRef = firebase.database().ref();
      this.roomPath = firebase.database().ref().child('room-wala');
      this.roomMessagePath = firebase.database().ref().child('roomwala-msg')
      this.conversationPath = firebase.database().ref().child('conversation-chat');
    }

    getRoomMessage(){

    }


    get(roomId){
      if (roomId) {
        let message: any;
        let groupMessageQuery = this.dbRef.child('roomwala-msg').child(roomId).orderByChild('createdAt');
        let query = groupMessageQuery.limitToLast(20).once('value');
        return Promise.all([query]).then((snapShot)=>{
          snapShot[0].forEach((childSnapshot)=>{
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if(childData)
              var messageObj = {
                id:key,
                sender_userid:childData.sender_userid,
                sender_username:childData.sender_username,
                createdAt:childData.createdAt,
                content:childData.content,
              }
              message.push(messageObj);
            });
          return message;
        });
      }
    };


    // group message
    sendGroupMessage(roomid, message, title): Promise<any>{
      let promise = new Promise((resolve, reject)=>{
        let chatMessage = {
          from: this.User.id,
          sender_username: this.User.name ? this.User.name: this.User.email,
          sender_email: this.User.email,
          sender_userid: this.User.id,
          content: message,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          read:false,
        };
        let query = this.roomMessagePath.child(roomid);
        let messageIdKey = query.push().key;
        return query.child(messageIdKey).set(chatMessage).then((res)=>{
          console.log(res, 'res'); 
          resolve();

          // set last message of group
          this.updateGroupLastMessage(roomid, chatMessage);
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
      
    }
    // group message end

    sendMessageToUser(messageData){
      console.log(messageData, 'mess');
      let setMsg = {
        conversations_id  : messageData.from_userId + '@@' + messageData.to_user_id,
        timestamp  : firebase.database.ServerValue.TIMESTAMP,
        notificationTitle : messageData.from_username,
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

      let newmessageidKey = this.conversationPath.push().key;
      return this.conversationPath.child(newmessageidKey).set(setMsg).then(val=>{
        return val;
      });
    }

    bindUserMessages(userId,toUserId,lastPageId) : Observable<any[]>{
      let messageList : any = [];
      if (userId && toUserId) {
        var index = lastPageId<=0 ? 20 : lastPageId;

        if (userId > toUserId) {
          [userId, toUserId] = [toUserId, userId];
        }

        let query = this.conversationPath.orderByChild('conversations_id').equalTo(userId+'@@'+toUserId);

        let getUserQuery = query.once('value');
        return new Observable(observer => {
          Promise.all([getUserQuery]).then(snapShot=>{
            snapShot[0].forEach((childSnapshot)=>{
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if(childData)
                var messageObj = {
                  id:key,
                  to_user_id:childData.to_user_id,
                  from_userId: childData.from_userId,
                  text:childData.text,
                  timestamp: childData.timestamp,
                  conversations_id:childData.conversations_id,
                }
                messageList.push(messageObj);
                console.log(messageList, 'message list');
                observer.next(messageList);
                observer.complete();
              });
          });
        });
      }
    };

    bindUserMessagesAddedEvent(userId,toUserId,lastPageId){
      let messageList: any = {};
      if (userId && toUserId) {
        let query = this.conversationPath.orderByChild('conversations_id').equalTo(userId+'@@'+toUserId);
        // query.on('child_added', (snapShot)=>{
          query.limitToList(1).on('child_added', (snapShot)=>{
            let key = snapShot.key;
            let childData = snapShot.val();
            if(childData){
              let messageObj = {
                id:key,
                to_user_id:childData.to_user_id,
                text:childData.text,
                timestamp:childData.timestamp,
                conversations_id:childData.conversations_id,
              }
              messageList = messageObj;
              console.log(messageList, 'assignes values', messageObj, 'message obj');
            }
          })
        }
      };


      // group

      bindGroupMessages(roomId, lastPageId): Promise<any>{
        let groupMessageList: any = [];
        let promise =  new Promise((resolve, reject)=>{
          if (roomId) {
            let query:any;
            // if (lastPageId == '0') {
              //   query = this.roomMessagePath.child(roomId).orderByKey().limitToLast(lastPageId).once('value');
              // }else {
                //   query = this.roomMessagePath.child(roomId).orderByKey().limitToLast(lastPageId).endAt().once('value');
                // }
                query = this.roomMessagePath.child(roomId).orderByKey().once('value');
                return query.then(Snapshot=>{
                  console.log(Snapshot, 'ss');
                  Snapshot.forEach((childSnapshot)=>{
                    let childGroupMsg = this.onChildGroupMessageLoaded(childSnapshot);
                    if (childGroupMsg) {
                      groupMessageList.push(childGroupMsg);
                      console.log(groupMessageList, 'group msg list');
                      resolve(groupMessageList);
                    }
                  });
                })
              } 
            });
        return promise;
      }

      onChildGroupMessageLoaded(Snapshot){
        var key = Snapshot.key;
        var childData = Snapshot.val();
        if(childData)
          var messageObj={
            id:key,
            sender_userid:childData.sender_userid,
            sender_username:childData.sender_username,
            sender_email:childData.sender_email,
            createdAt:childData.createdAt,
            content:childData.content,
          }
          // message.push(messageObj);
          return messageObj;
        };

        // group message listener
        setUpGroupMessageListiner(roomIdVal):Promise<any>{
          let messageList = [];
          let promise = new Promise((resolve, reject)=>{
            let roomId = roomIdVal ? roomIdVal : this.roomDetail.roomId;
            let query = this.roomMessagePath.child(roomId).orderByKey();
            return query.on('child_added', (snapShot)=>{
              if (snapShot) {
                let newMsg = this.onChildGroupMessageAdded(snapShot);
                if (newMsg) {
                  messageList.push(newMsg);
                  resolve(newMsg);
                  this.events.publish('groupMessage:Added', newMsg);
                }
              }
            })
          });
          return promise;
        }


        onChildGroupMessageAdded(Snapshot){
          var key = Snapshot.key;
          var childData = Snapshot.val();
          if(childData)
            var messageObj=
          {
            id:key,
            sender_userid:childData.sender_userid,
            sender_username:childData.sender_username,
            createdAt:childData.createdAt,
            content:childData.content,
          }
          return (messageObj);
        };

        // group message listener end

        // set last message to group
        updateGroupLastMessage(roomId, data){
          let updateGroupData = {
            last_message: data.content,
            last_message_time: data.createdAt,
            last_message_user: this.User.email
          }
          this.roomPath.child(roomId).update(updateGroupData);
        }
        // set last message to group end
      }
