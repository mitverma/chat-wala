import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from '../../providers/entities/entities';
import { Storage } from '@ionic/storage';

@Injectable()
export class DevicestorageProvider {

	constructor(public http: HttpClient, public storage: Storage, public User: AuthUser) {
		console.log('Hello DevicestorageProvider Provider');
	}

	setValue(key, value) : Promise<any>{
		return this.storage.ready().then(()=>{
			return this.storage.set(key, value).then((res)=>{
				return res; 
			}).catch(()=>{
				return null; 
			})
		})
	}

	getValue(key): Promise<any>{
		return this.storage.get(key).then((res)=>{
			return res;
		}).catch(()=>{
			return null;
		})
	}

	clearValue(): Promise<any>{
		return this.storage.clear();
	}

	removeValue(key): Promise<any>{
		return this.storage.remove(key);
	}

}
