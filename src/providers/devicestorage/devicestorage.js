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
import { AuthUser } from '../../providers/entities/entities';
import { Storage } from '@ionic/storage';
var DevicestorageProvider = /** @class */ (function () {
    function DevicestorageProvider(http, storage, User) {
        this.http = http;
        this.storage = storage;
        this.User = User;
        console.log('Hello DevicestorageProvider Provider');
    }
    DevicestorageProvider.prototype.setValue = function (key, value) {
        var _this = this;
        return this.storage.ready().then(function () {
            return _this.storage.set(key, value).then(function (res) {
                return res;
            }).catch(function () {
                return null;
            });
        });
    };
    DevicestorageProvider.prototype.getValue = function (key) {
        return this.storage.get(key).then(function (res) {
            return res;
        }).catch(function () {
            return null;
        });
    };
    DevicestorageProvider.prototype.clearValue = function () {
        return this.storage.clear();
    };
    DevicestorageProvider.prototype.removeValue = function (key) {
        return this.storage.remove(key);
    };
    DevicestorageProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Storage, AuthUser])
    ], DevicestorageProvider);
    return DevicestorageProvider;
}());
export { DevicestorageProvider };
//# sourceMappingURL=devicestorage.js.map