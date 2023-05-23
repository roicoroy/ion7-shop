import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from } from 'rxjs';

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
  getFromPromise(key: any) {
    return this.storage.get(key).then((data) => data,
      error => console.error(error));
  }
  getKeyAsObservable(key: any): Observable<any> {
    return from(this.getFromPromise(key));
  }
  public async getToken() {
    if (!this.token) {
      this.token = await this.storage.get('token');
      return this.token;
    }
    return this.token;
  }
  public async setToken(token: string) {
    this.token = token;
    this.storage.set('token', token);
  }
  public async deleteToken() {
    this.token = null;
    this.storage.remove('token');
  }
}
