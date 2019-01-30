import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RegisterPageModule } from '../pages/register/register.module';
import { AuthProvider } from '../providers/auth/auth';
import { AuthserviceProvider } from '../providers/authservice/authservice';
import { AuthUser, RoomDetail } from '../providers/entities/entities';
import { DevicestorageProvider } from '../providers/devicestorage/devicestorage';
import { RoomserviceProvider } from '../providers/roomservice/roomservice';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { MessageServiceProvider } from '../providers/message-service/message-service';

import * as firebase from 'firebase';
import { IonicStorageModule } from "@ionic/storage";
import { DatePipe } from '@angular/common';



export const config = {
  apiKey: "AIzaSyA3WZLxl63CKvzj4sIg2fZjOVaUYvtzrwY",
  authDomain: "chat-666d8.firebaseapp.com",
  databaseURL: "https://chat-666d8.firebaseio.com",
  projectId: "chat-666d8",
  storageBucket: "",
  messagingSenderId: "162204499457"
};

firebase.initializeApp(config);


@NgModule({
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
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  AuthProvider,
  AuthserviceProvider,
  AuthUser,
  RoomDetail,
  DevicestorageProvider,
  RoomserviceProvider,
  UserServiceProvider,
  MessageServiceProvider
  ]
})
export class AppModule {}
