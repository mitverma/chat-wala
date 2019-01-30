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
import { DevicestorageProvider } from '../../providers/devicestorage/devicestorage';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
var AuthProvider = /** @class */ (function () {
    function AuthProvider(http, User, deviceStorage) {
        this.http = http;
        this.User = User;
        this.deviceStorage = deviceStorage;
        console.log('Hello AuthProvider Provider');
    }
    Object.defineProperty(AuthProvider.prototype, "getUser", {
        get: function () {
            return this.User;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "setUser", {
        set: function (value) {
            this.User = value;
        },
        enumerable: true,
        configurable: true
    });
    AuthProvider.prototype.signup = function (userData) {
        return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password).then(function (value) {
            if (value) {
                console.log(value, 'value');
                userData.uid = value.user.uid;
                // this.setUser = this.User; 
                return userData;
            }
        }).catch(function (error) {
            console.log('Something went wrong:', error.message);
            return error;
        });
    };
    ;
    AuthProvider.prototype.login = function (email, password) {
        var _this = this;
        return firebase.auth().signInWithEmailAndPassword(email, password).then(function (value) {
            if (value) {
                console.log(value, value.user.uid);
                firebase.database().ref().child('userList').orderByChild("uid").equalTo(value.user.uid).once('value', function (snapShot) {
                    var userValue = snapShot.val();
                    console.log(userValue, 'user value', Object.keys(userValue));
                    var userArrayDetail = Object.keys(userValue).map(function (keys) { return userValue[keys]; });
                    var userDetail = {
                        uid: userArrayDetail[0] ? userArrayDetail[0].uid : value.user.uid,
                        name: userArrayDetail[0] ? userArrayDetail[0].name : '',
                        email: userArrayDetail[0] ? userArrayDetail[0].email : value.user.uid,
                        id: Object.keys(userValue) ? Object.keys(userValue)[0] : Object.keys(snapShot.val())[0],
                        deviceToken: '',
                        status: true,
                    };
                    Object.assign(_this.User, userDetail);
                    // device storage
                    return _this.deviceStorage.setValue(_this.User.auth_token, _this.User).then(function (user) {
                        return user ? user : _this.User;
                    }).catch(function () {
                        return null;
                    });
                    // device storage end
                });
            }
        })
            .catch(function (error) {
            console.log('Something went wrong:', error.message);
            return error;
        });
    };
    ;
    AuthProvider.prototype.logout = function () {
        firebase.auth().signOut();
    };
    AuthProvider.prototype.ensureAuthenticate = function () {
        var _this = this;
        return this.deviceStorage.getValue(this.User.auth_token).then(function (user) {
            return user ? Object.assign(_this.User, user) : _this.User;
        }).catch(function () {
            return null;
        });
    };
    AuthProvider.prototype.authenticateUser = function () {
        var _this = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user.uid != _this.User.uid) {
                // this.updateUserList();
            }
        });
    };
    AuthProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, AuthUser, DevicestorageProvider])
    ], AuthProvider);
    return AuthProvider;
}());
export { AuthProvider };
//# sourceMappingURL=auth.js.map