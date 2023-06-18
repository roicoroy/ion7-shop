import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { IAuthStateModel } from 'src/app/store/auth/auth.interface';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { AppService } from 'src/app/shared/services/application/application.service';
import { StrapiAuthProviders } from 'src/app/shared/types/StrapiAuthConfig';
import { Auth0Actions } from 'src/app/store/auth/auth0/auth0.actions';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth0',
  templateUrl: './auth0.page.html',
  styleUrls: ['./auth0.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
  ]
})
export class Auth0Page implements OnInit {
  private platform = inject(Platform);
  private native = inject(AppService);
  private navigation = inject(NavigationService);
  private utility = inject(UtilityService);
  private store = inject(Store);
  private provider: StrapiAuthProviders = 'auth0';

  mockUrl = 'https://ion-shop-online.web.app/auth0-callback?id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTFOa1U1T0RWRU9UQXpNRVpFUTBKRE1FSXdRVVkzTlRJMVFrRkZRa1E1Umpnd09VVXpSUSJ9.eyJuaWNrbmFtZSI6InJvaWNvcm95IiwibmFtZSI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83ZmJhNTliMzBiZmZiYmE3MmVkYjA2M2Y4ODYyNGU1Nj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnJvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA0LTEzVDE4OjA5OjMxLjQyNVoiLCJlbWFpbCI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3JvaWNvcm95LmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJkTFNaNTRvbFpwbHdseUt1TUJWcWFUSHZPejVFOHY1bCIsImlhdCI6MTY4MTQwOTM3MiwiZXhwIjoxNjgxNDQ1MzcyLCJzdWIiOiJhdXRoMHw2NDJkYjUwNWIzZGEzYWI1MTQ5MzRiNWYiLCJzaWQiOiJGVmY3Q3hQUm9YbjV0TnBlOFp2a1BjTnU1dXV3SnF2VyJ9.n2lYxZxz2SDShiqj2ZjMuUW0HSi2jvt_NP-eVjwntWuPXx1oETA7lIPK_fcuM-esXQnFYcvFsuM03lI03yEUAtic_oY2jYLQXbZDKSRKNw77s2jjDq8hR8LUuRDCF-em2BlWd9CIiSghAoZYxv3t1aGUXFPL8m7xy_d1fA410Qs5Rr3uADBFjD-_z82ggxE-nFLKS4zz4oSb9xz3ig3aLDKItNRLHYkOmUIz9LKihS2_H9ZPcUL0_TzfQpRcG5az_nC4FrpaDQ37nXcxppc3e8Lb4AFYDWKDxHJQFcaU2VbtW9Fo0L5o6JQ8uBa-21CshD_sAeHKgCW0TUDhscxJbw&access_token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9yb2ljb3JveS5ldS5hdXRoMC5jb20vIn0..fZdQVTQm0ddjWiBa.7FM0pWaFNvC1syQ8mXYKjnYKPYn_m6pEdBhDB3ssAq9YjNvWrmOSxhX6IRr6QQ3klu8J0N55sd4HpRM1ODYgUuuJrG3jIo88-rWeGSeLkVTajbLhZYPg5ZxAETA359IIfDmHyvRdQ41ssYrZGPTT5U08Eq44KR2fg3iFdV68eYe9oaIaK7KX3fzFezJVUfTJUMcKCEab9XFBZbhSdJd2MRhJD7UsD6GQXD-h__slNtSrp6VGEOzNK4n4s0L_upQLXtI4TfmGNLwSMcd94LLVSTTf2eWh7n5JlSJx5mzd3jMiCz3xRgLlD1oU.RP4jKHkTgsnmYaYp45ebeQ&raw%5Baccess_token%5D=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9yb2ljb3JveS5ldS5hdXRoMC5jb20vIn0..fZdQVTQm0ddjWiBa.7FM0pWaFNvC1syQ8mXYKjnYKPYn_m6pEdBhDB3ssAq9YjNvWrmOSxhX6IRr6QQ3klu8J0N55sd4HpRM1ODYgUuuJrG3jIo88-rWeGSeLkVTajbLhZYPg5ZxAETA359IIfDmHyvRdQ41ssYrZGPTT5U08Eq44KR2fg3iFdV68eYe9oaIaK7KX3fzFezJVUfTJUMcKCEab9XFBZbhSdJd2MRhJD7UsD6GQXD-h__slNtSrp6VGEOzNK4n4s0L_upQLXtI4TfmGNLwSMcd94LLVSTTf2eWh7n5JlSJx5mzd3jMiCz3xRgLlD1oU.RP4jKHkTgsnmYaYp45ebeQ&raw%5Bid_token%5D=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTFOa1U1T0RWRU9UQXpNRVpFUTBKRE1FSXdRVVkzTlRJMVFrRkZRa1E1Umpnd09VVXpSUSJ9.eyJuaWNrbmFtZSI6InJvaWNvcm95IiwibmFtZSI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83ZmJhNTliMzBiZmZiYmE3MmVkYjA2M2Y4ODYyNGU1Nj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnJvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA0LTEzVDE4OjA5OjMxLjQyNVoiLCJlbWFpbCI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3JvaWNvcm95LmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJkTFNaNTRvbFpwbHdseUt1TUJWcWFUSHZPejVFOHY1bCIsImlhdCI6MTY4MTQwOTM3MiwiZXhwIjoxNjgxNDQ1MzcyLCJzdWIiOiJhdXRoMHw2NDJkYjUwNWIzZGEzYWI1MTQ5MzRiNWYiLCJzaWQiOiJGVmY3Q3hQUm9YbjV0TnBlOFp2a1BjTnU1dXV3SnF2VyJ9.n2lYxZxz2SDShiqj2ZjMuUW0HSi2jvt_NP-eVjwntWuPXx1oETA7lIPK_fcuM-esXQnFYcvFsuM03lI03yEUAtic_oY2jYLQXbZDKSRKNw77s2jjDq8hR8LUuRDCF-em2BlWd9CIiSghAoZYxv3t1aGUXFPL8m7xy_d1fA410Qs5Rr3uADBFjD-_z82ggxE-nFLKS4zz4oSb9xz3ig3aLDKItNRLHYkOmUIz9LKihS2_H9ZPcUL0_TzfQpRcG5az_nC4FrpaDQ37nXcxppc3e8Lb4AFYDWKDxHJQFcaU2VbtW9Fo0L5o6JQ8uBa-21CshD_sAeHKgCW0TUDhscxJbw&raw%5Bscope%5D=openid%20profile%20email&raw%5Bexpires_in%5D=86400&raw%5Btoken_type%5D=Bearer';
  mockLocation = "?id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTFOa1U1T0RWRU9UQXpNRVpFUTBKRE1FSXdRVVkzTlRJMVFrRkZRa1E1Umpnd09VVXpSUSJ9.eyJuaWNrbmFtZSI6InJvaWNvcm95IiwibmFtZSI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83ZmJhNTliMzBiZmZiYmE3MmVkYjA2M2Y4ODYyNGU1Nj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnJvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA0LTE3VDEwOjQ3OjUzLjE1M1oiLCJlbWFpbCI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3JvaWNvcm95LmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJkTFNaNTRvbFpwbHdseUt1TUJWcWFUSHZPejVFOHY1bCIsImlhdCI6MTY4MTcyODQ3MywiZXhwIjoxNjgxNzY0NDczLCJzdWIiOiJhdXRoMHw2NDJkYjUwNWIzZGEzYWI1MTQ5MzRiNWYiLCJzaWQiOiJxa1RDSklDVW9PWU1KeE03QzA0b0x3QjVOcm1sanc1UiJ9.CUKQKLaaA95ttuto1xbzG226NhmVwri9M_Xu4DFRL1N5XhVwzBcOiXar2-l-05yFzLVeECwnLBA8_TKjx0iuMJpFXk5UIEqL2_kTuYpDBmyZKPLiXcuQq0F1-P7-u80uFQ_uPdGHu3UdOILBAsQTwEqlHBdszWDwSseWCdIusk6TiqpLqxT2roFxlxNfaawxj8P1EvPGIDWR547Eit9wfNtljsaqZhLMN6BJDjQfaLjJsDrnbSV9Oc1O0i4zenPV0gPXX7k3qvDuTenpQ2bCu6neWVe6DmsNz7PuZEsCML0Iojth6PbQGMqIwaepBjPpyyoRaiAiroO3e9T74CA85w&access_token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9yb2ljb3JveS5ldS5hdXRoMC5jb20vIn0..ULoKaA7eF96S28fh.8G_BgSZpI0XoQ_KuBFaqGxFXexX8lk3UTS4BiEDc5XNcBulEqZBVABSsCZ99g8vij5pjwWbwqio202-2COj7TmE4QXuHbUZjk1ObqL4LowLbn8hzEcgaSDRvXQ0woLrzs7ooOH6za1iJjTQa_1kvFWFGY0m74WVEs6JM-KWgQwpDykUwoCcBlPjKO6G3waSSxssOM_nC8HUSJstSf3qVwbPywLoxljbTAEqamQyS3e247bmnOt63fapvR3JfdqYyv2HzWgPB5Vjm1Zf4BnqaIUeRoETxDqcoVTQAexSRNQ1iBY0gt2z-jo8C.YwOw3laD76WMgFXMuQvNrw&raw%5Baccess_token%5D=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9yb2ljb3JveS5ldS5hdXRoMC5jb20vIn0..ULoKaA7eF96S28fh.8G_BgSZpI0XoQ_KuBFaqGxFXexX8lk3UTS4BiEDc5XNcBulEqZBVABSsCZ99g8vij5pjwWbwqio202-2COj7TmE4QXuHbUZjk1ObqL4LowLbn8hzEcgaSDRvXQ0woLrzs7ooOH6za1iJjTQa_1kvFWFGY0m74WVEs6JM-KWgQwpDykUwoCcBlPjKO6G3waSSxssOM_nC8HUSJstSf3qVwbPywLoxljbTAEqamQyS3e247bmnOt63fapvR3JfdqYyv2HzWgPB5Vjm1Zf4BnqaIUeRoETxDqcoVTQAexSRNQ1iBY0gt2z-jo8C.YwOw3laD76WMgFXMuQvNrw&raw%5Bid_token%5D=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTFOa1U1T0RWRU9UQXpNRVpFUTBKRE1FSXdRVVkzTlRJMVFrRkZRa1E1Umpnd09VVXpSUSJ9.eyJuaWNrbmFtZSI6InJvaWNvcm95IiwibmFtZSI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83ZmJhNTliMzBiZmZiYmE3MmVkYjA2M2Y4ODYyNGU1Nj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnJvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA0LTE3VDEwOjQ3OjUzLjE1M1oiLCJlbWFpbCI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3JvaWNvcm95LmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJkTFNaNTRvbFpwbHdseUt1TUJWcWFUSHZPejVFOHY1bCIsImlhdCI6MTY4MTcyODQ3MywiZXhwIjoxNjgxNzY0NDczLCJzdWIiOiJhdXRoMHw2NDJkYjUwNWIzZGEzYWI1MTQ5MzRiNWYiLCJzaWQiOiJxa1RDSklDVW9PWU1KeE03QzA0b0x3QjVOcm1sanc1UiJ9.CUKQKLaaA95ttuto1xbzG226NhmVwri9M_Xu4DFRL1N5XhVwzBcOiXar2-l-05yFzLVeECwnLBA8_TKjx0iuMJpFXk5UIEqL2_kTuYpDBmyZKPLiXcuQq0F1-P7-u80uFQ_uPdGHu3UdOILBAsQTwEqlHBdszWDwSseWCdIusk6TiqpLqxT2roFxlxNfaawxj8P1EvPGIDWR547Eit9wfNtljsaqZhLMN6BJDjQfaLjJsDrnbSV9Oc1O0i4zenPV0gPXX7k3qvDuTenpQ2bCu6neWVe6DmsNz7PuZEsCML0Iojth6PbQGMqIwaepBjPpyyoRaiAiroO3e9T74CA85w&raw%5Bscope%5D=openid%20profile%20email&raw%5Bexpires_in%5D=86400&raw%5Btoken_type%5D=Bearer";
  async ngOnInit() {
    const device = await this.native.getDeviceInfo();
    const location = window.location.search;
    const urlArray = location.split("id_token=");
    const token = urlArray[1];
    if (device.platform == 'web' && location) {
      this.store.dispatch(new Auth0Actions.Auth0ProviderCallback(token, this.provider))
        .subscribe((state: IAuthStateModel) => {
          console.log(state);
          setTimeout(() => {
            const isLoggedIn = this.store.selectSnapshot<any>((state: any) => state.authState?.isLoggedIn);
            if (isLoggedIn) {
              // this.utility.presentAlert('You are logged in...');
              this.navigation.navControllerDefault('/start/tabs/home').then(() => { });
            }
          }, 1000);
        });
    }
    if (device.platform === 'android' || device.platform === 'ios') {
      await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        const urlArray = event.url.split("id_token=");
        this.store.dispatch(new Auth0Actions.Auth0ProviderCallback(urlArray[1], this.provider))
          .subscribe((state: IAuthStateModel) => {
            if (state.isLoggedIn) {
              this.utility.presentAlert('You are logged in...')
              this.navigation.navControllerDefault('home').then(() => { });
            }
          });
      });
    }
  }
  /**
   * Login user using external provider
   * Auth0
  `*/
  async loginAuth0() {
    const url = `${environment.BASE_PATH}/api/connect/${'auth0'}`;
    await Browser.open({ url, windowName: '_self' });

  }
  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Inbox' : '';
  }
}