import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthUser } from '../../providers/entities/entities';
import { RoomDetail } from  '../../providers/entities/entities'
import { RoomserviceProvider } from  '../../providers/roomservice/roomservice'
import { ActionSheetController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
/**
 * Generated class for the RoomInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-room-info',
 	templateUrl: 'room-info.html',
 })
 export class RoomInfoPage {
 	groupDetail: any = {};
 	membersList = [];
 	roomInfo: any = {};

 	constructor(public navCtrl: NavController, public navParams: NavParams, public User: AuthUser, public roomDetail: RoomDetail, public roomService: RoomserviceProvider, public actionSheetCtrl: ActionSheetController, public datePipe: DatePipe) {
 		this.groupDetail = {
 			name: '',
 			createdAt: ''
 		}
 	}

 	ionViewDidLoad() {
 		if (this.navParams && this.navParams.data) {
 			this.roomInfo = this.navParams.data;

 			this.groupDetail.name = this.roomInfo.name;
 			this.groupDetail.createdAt = this.datePipe.transform(this.roomInfo.createdAt, 'dd-MMM-yyyy hh:mm a');

 			this.groupInfo();
 		}
 		console.log('ionViewDidLoad RoomInfoPage');
 	}

 	groupInfo(){
 		let roomId =  this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		this.roomService.getMemberInRoom(roomId).then((res)=>{
 			if (res) {
 				this.membersList = res;
 			}
 		});
 	};

 	getGroupDetails(){
 		let roomId =  this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		this.roomService.getRoomDetails(roomId).then((roomData)=>{
 			if (roomData) {
 				this.groupDetail = roomData;
 			}
 		})
 	}

 	assignRole(userDetail){
 		let roomId =  this.roomInfo.roomId ? this.roomInfo.roomId : this.roomDetail.roomId;
 		let viewBtnText = userDetail.role == 'owner' ? 'Dismiss as owner' : 'Make as owner';
 		let viewBtnValue = userDetail.role == 'owner' ? 'owner' : 'member';
 		const actionSheet = this.actionSheetCtrl.create({
 			buttons: [
 			{
 				text: viewBtnText,
 				role: 'destructive',
 				handler: () => {
 					console.log(viewBtnValue);
 					if (viewBtnValue == 'owner') {
 						this.roomService.updateRole(roomId, userDetail.id,'member').then(res=>{
 							this.groupInfo();
 						});
 					}else {
 						this.roomService.updateRole(roomId, userDetail.id,'owner').then(res=>{
 							this.groupInfo();
 						});
 					}
 				}
 			},{
 				text: 'Cancel',
 				role: 'cancel',
 				handler: () => {
 					console.log('Cancel clicked');
 				}
 			}
 			]
 		});
 		actionSheet.present();
 	}
 }
