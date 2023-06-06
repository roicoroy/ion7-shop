import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

@Component({
  selector: 'app-home',
  templateUrl: './auth-home.page.html',
  styleUrls: ['./auth-home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ]
})
export class AuthHomePage {

  private navigation = inject(NavigationService);

  navigateAuth0Callback() {
    this.navigation.navControllerDefault('auth/pages/strapi-auth0');
  }
  loginEmailPassword() {
    this.navigation.navControllerDefault('auth/pages/email/flow/email-password');
  }
}
