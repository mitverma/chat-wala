import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserlistPage } from './userlist';

@NgModule({
	declarations: [
	UserlistPage,
	],
	imports: [
	IonicPageModule.forChild(UserlistPage),
	],
	entryComponents: [
	UserlistPage
	],
	exports: [
	UserlistPage
	]
})
export class UserlistPageModule {}
