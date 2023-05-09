import { Injectable } from '@angular/core';
import { Observable, from, } from 'rxjs';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getKeyAsObservable(key: any): Observable<any> {
    return from(this.getFromPromise(key));
  }
  async getFromPromise(key: any) {
    // return this.storage.get(key)
    return await Storage.get({ key: key });
  }
  async storageSet(key: any, value: any): Promise<any> {
    // return await this.storage.set(key, value);
    await Storage.set({
      key: key,
      value: value
    });
  }
  async storageGet(key: any): Promise<any> {
    // return await this.storage.get(key);
    return await Storage.get({ key: key });
  }
  async storageRemove(key: any): Promise<any> {
    // return await this.storage.remove(key);
    return await Storage.remove({ key: key });
  }
}
