// import { Injectable, inject } from '@angular/core';
// import jwt_decode from 'jwt-decode';
// import { Token } from '../../types/models/Token';
// import { Storage } from '@capacitor/storage';
// import { StorageService } from '../storage/ionstorage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class TokenService {
//   private token: string;
  
//   storage = inject(StorageService);

//   /**
//    * Get token variable and write token to Capacitor storage
//    */
//   public async getToken() {
//     if (!this.token) {
//       this.token = await this.storage.storageGet('token');
//       return this.token;
//     }
//     return this.token;
//   }

//   /**
//    * Set token variable and write token to Capacitor storage
//    */
//   public async setToken(token: string) {
//     this.token = token;
//     this.storage.storageSet('token', token);
//   }

//   /**
//    * Delete token in Capacitor storage
//    */
//   public async deleteToken() {
//     this.token = null;
//     this.storage.storageRemove('token');
//   }
// }


import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Token } from '../../types/models/Token';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string;

  constructor(
    private storage: Storage,
  ) {
    this.init();
  }
  async init() {
    return await this.storage.create();
  }
  /**
   * Return token if given
   */
  public async getToken() {
    if (!this.token) {
      this.token = await this.storage.get('token');
      return this.token;
    }
    return this.token;
  }

  /**
   * Set token variable and write token to local storage
   */
  public async setToken(token: string) {
    this.token = token;
    this.storage.set('token', token);
  }

  /**
   * Delete token in local storage
   */
  public async deleteToken() {
    this.token = null;
    this.storage.remove('token');
  }

  /**
   * Decode token
   */
  private decodeToken(token: string): Token | void {
    try {
      return jwt_decode(token) as Token;
    } catch (error) {
      return;
    }
  }
}
