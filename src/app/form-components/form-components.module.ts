import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { PasswordFormComponent } from './components/password-form/password-form.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { GuestFormComponent } from './components/guest-form/guest-form.component';
import { AddressDetailsFormComponent } from './components/address-details-form /address-details-form.component';
import { CustomComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule,
    CustomComponentsModule,
  ],
  declarations: [
    PasswordFormComponent,
    ProfileFormComponent,
    AddressFormComponent,
    LoginFormComponent,
    UserFormComponent,
    GuestFormComponent,
    AddressDetailsFormComponent
  ],
  exports: [
    PasswordFormComponent,
    ProfileFormComponent,
    AddressFormComponent,
    LoginFormComponent,
    UserFormComponent,
    GuestFormComponent,
    AddressDetailsFormComponent
  ]
})
export class FormComponentsModule { }
