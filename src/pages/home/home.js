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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RoomserviceProvider } from '../../providers/roomservice/roomservice';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthProvider } from '../../providers/auth/auth';
import { OrderByPipe } from '../../pipes/filters/filters';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, navParams, roomService, authService, userService, orderBy) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.roomService = roomService;
        this.authService = authService;
        this.userService = userService;
        this.orderBy = orderBy;
        this.chatList = [];
        this.authService.ensureAuthenticate().then(function (user) {
            _this.roomService.setupGroupAddedListener().then(function (res) {
                if (res && res.length) {
                    res.forEach(function (list) {
                        list.createdAt = new Date(list.createdAt);
                        list.displayDate = new Date(list.displayDate);
                        _this.chatList.push(list);
                        _this.orderBy.transform(_this.chatList, ['-createdAt']);
                    });
                }
            });
            _this.userService.UsersAddEventListener().then(function (res) {
                if (res && res.length) {
                    res.forEach(function (list) {
                        list.createdAt = new Date(list.createdAt);
                        list.displayDate = new Date(list.displayDate);
                        _this.chatList.push(list);
                        console.log(_this.chatList, 'list users');
                        _this.orderBy.transform(_this.chatList, ['-createdAt']);
                    });
                }
            });
        });
    }
    HomePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad HomePage');
    };
    HomePage.prototype.loadGroupsAndUsers = function () {
        this.roomService.loadGroupsLastConv();
    };
    HomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-home',
            templateUrl: 'home.html',
            providers: [OrderByPipe]
        }),
        __metadata("design:paramtypes", [NavController, NavParams, RoomserviceProvider, AuthProvider, UserServiceProvider, OrderByPipe])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map