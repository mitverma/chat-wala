import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoomInfoPage } from './room-info';

@NgModule({
	declarations: [
	RoomInfoPage,
	],
	imports: [
	IonicPageModule.forChild(RoomInfoPage),
	],
	entryComponents: [
	RoomInfoPage
	],
	exports:[
	RoomInfoPage
	]
})
export class RoomInfoPageModule {}
