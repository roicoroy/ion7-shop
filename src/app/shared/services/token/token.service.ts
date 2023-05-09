import { Injectable, inject } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Token } from '../../types/models/Token';
import { Storage } from '@capacitor/storage';
import { StorageService } from '../storage/ionstorage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string;
  
  storage = inject(StorageService);

  /**
   * Get token variable and write token to Capacitor storage
   */
  public async getToken() {
    if (!this.token) {
      this.token = await this.storage.storageGet('token');
      return this.token;
    }
    return this.token;
  }

  /**
   * Set token variable and write token to Capacitor storage
   */
  public async setToken(token: string) {
    this.token = token;
    this.storage.storageSet('token', token);
  }

  /**
   * Delete token in Capacitor storage
   */
  public async deleteToken() {
    this.token = null;
    this.storage.storageRemove('token');
  }
}
