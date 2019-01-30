var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
var AuthUser = /** @class */ (function () {
    function AuthUser() {
        console.log('AuthUser Called::');
        this.id = '';
        this.uid = '';
        this.name = '';
        this.email = '';
        this.deviceToken = '';
        this.status = true;
        this.auth_token = 'APP_USER';
    }
    AuthUser = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], AuthUser);
    return AuthUser;
}());
export { AuthUser };
var RoomDetail = /** @class */ (function () {
    function RoomDetail() {
        this.roomId = '';
        this.name = '';
        this.lastMessage = '';
        this.createdAt = '';
    }
    RoomDetail = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], RoomDetail);
    return RoomDetail;
}());
export { RoomDetail };
//# sourceMappingURL=entities.js.map