var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegisterPageModule } from '../pages/register/register.module';
import { AuthProvider } from '../providers/auth/auth';
import { AuthserviceProvider } from '../providers/authservice/authservice';
import { AuthUser } from '../providers/entities/entities';
import { DevicestorageProvider } from '../providers/devicestorage/devicestorage';
import { RoomserviceProvider } from '../providers/roomservice/roomservice';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { MessageServiceProvider } from '../providers/message-service/message-service';
import * as firebase from 'firebase';
import { IonicStorageModule } from "@ionic/storage";
import { DatePipe } from '@angular/common';
export var config = {
    apiKey: "AIzaSyA3WZLxl63CKvzj4sIg2fZjOVaUYvtzrwY",
    authDomain: "chat-666d8.firebaseapp.com",
    databaseURL: "https://chat-666d8.firebaseio.com",
    projectId: "chat-666d8",
    storageBucket: "",
    messagingSenderId: "162204499457"
};
firebase.initializeApp(config);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
            ],
            imports: [
                BrowserModule,
                RegisterPageModule,
                HttpClientModule,
                IonicModule.forRoot(MyApp),
                IonicStorageModule.forRoot(),
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
            ],
            providers: [
                DatePipe,
                StatusBar,
                SplashScreen,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                AuthProvider,
                AuthserviceProvider,
                AuthUser,
                DevicestorageProvider,
                RoomserviceProvider,
                UserServiceProvider,
                MessageServiceProvider
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map