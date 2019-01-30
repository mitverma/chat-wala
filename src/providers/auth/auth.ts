import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AuthUser } from '../../providers/entities/entities';
import { DevicestorageProvider } from '../../providers/devicestorage/devicestorage';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class AuthProvider {
    constructor(public http: HttpClient, public User: AuthUser, public deviceStorage: DevicestorageProvider) {
      console.log('Hello AuthProvider Provider');      
    }

    get getUser(): AuthUser {
      return this.User;
    }

    set setUser(value: AuthUser) { 
      this.User = value;
    }

    signup(userData){
      return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password).then((value)=>{
        if (value) {
          console.log(value, 'value');
          userData.uid = value.user.uid;
          // this.setUser = this.User; 
          return userData;
        }
      }).catch(error=>{
        console.log('Something went wrong:',error.message);
        return error;
      })
    };

    login(email: string, password: string) {
      return firebase.auth().signInWithEmailAndPassword(email, password).then(value => {
        if (value) {
          console.log(value, value.user.uid);
          firebase.database().ref().child('userList').orderByChild("uid").equalTo(value.user.uid).once('value', (snapShot)=>{
            let userValue = snapShot.val();
            console.log(userValue, 'user value', Object.keys(userValue),);
            let userArrayDetail = Object.keys(userValue).map(keys => userValue[keys]);
            let userDetail = {
              uid : userArrayDetail[0] ? userArrayDetail[0].uid : value.user.uid,
              name :  userArrayDetail[0] ? userArrayDetail[0].name : '',
              email :  userArrayDetail[0] ?  userArrayDetail[0].email: value.user.uid,
              id: Object.keys(userValue) ? Object.keys(userValue)[0] : Object.keys(snapShot.val())[0],
              deviceToken :  '',
              status :  true,
            };
            Object.assign(this.User, userDetail);
            // device storage
            return this.deviceStorage.setValue(this.User.auth_token, this.User).then((user) => {
              return user ? user : this.User;
            }).catch(() => {
              return null;
            }); 
            // device storage end
          })
        }
      })
      .catch(error => {
        console.log('Something went wrong:',error.message);
        return error;
      });
    };

    logout(){
      firebase.auth().signOut();
    }

    ensureAuthenticate(){
      return this.deviceStorage.getValue(this.User.auth_token).then((user) => {
        return user ? Object.assign(this.User, user) : this.User;
      }).catch(() => {
        return null;
      });
    }

    authenticateUser(){
      firebase.auth().onAuthStateChanged((user: any)=>{
        if (user.uid != this.User.uid) {
          // this.updateUserList();
        }
      })  
    }

  }
