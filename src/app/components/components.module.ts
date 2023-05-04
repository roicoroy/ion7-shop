import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckboxWrapperComponent } from './components/checkbox-wrapper/checkbox-wrapper.component';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { CounterInputComponent } from './components/counter-input/counter-input.component';

import { RatingInputComponent } from './components/rating-input/rating-input.component';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { ShellModule } from './shell/shell.module';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { CartMenuComponent } from './components/app-menu/cart-menu.component';
import { MedusaCartComponent } from './components/medusa-cart/medusa-cart.component';
import { ContactCardPage } from './components/contact-card/contact-card.page';
import { SettingsComponent } from './components/settings/settings.component';
import { AddressCardComponent } from './components/address-card/address-card.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ItemsComponent } from './components/items/items.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguageComponent } from './components/language-component/language.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    ShellModule,
  ],
  declarations: [
    CheckboxWrapperComponent,
    ShowHidePasswordComponent,
    CountdownTimerComponent,
    CounterInputComponent,
    RatingInputComponent,
    CartMenuComponent,
    MedusaCartComponent,
    ContactCardPage,
    SettingsComponent,
    AddressCardComponent,
    OrderDetailsComponent,
    ItemsComponent,
    HeaderComponent,
    LanguageComponent,
    CategoriesComponent
  ],
  exports: [
    ShellModule,
    CheckboxWrapperComponent,
    ShowHidePasswordComponent,
    CountdownTimerComponent,
    CounterInputComponent,
    RatingInputComponent,
    CartMenuComponent,
    MedusaCartComponent,
    ContactCardPage,
    SettingsComponent,
    AddressCardComponent,
    OrderDetailsComponent,
    ItemsComponent,
    HeaderComponent,
    LanguageComponent,
    CategoriesComponent
  ]
})
export class CustomComponentsModule { }
