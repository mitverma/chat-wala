import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoomPage } from './room';

@NgModule({
	declarations: [
	RoomPage,
	],
	imports: [
	IonicPageModule.forChild(RoomPage),
	],
	entryComponents: [
	RoomPage
	],
	exports: [
	RoomPage
	]
})
export class RoomPageModule {}
