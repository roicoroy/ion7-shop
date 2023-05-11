import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app/app.routes';
import { environment } from './environments/environment';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { AppComponent } from './app/app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StrapiMedusaInterceptor } from './app/shared/interceptor/strapi-medusa.interceptor';
import { AuthState } from './app/store/auth/auth.state';
import { EmailPasswordState } from './app/store/auth/email-password/email-password.state';
import { AddressesState } from './app/store/addresses/addresses.state';
import { CartState } from './app/store/cart/cart.state';
import { CustomerRegisterState } from './app/store/customer-register/customer-register.state';
import { CustomerState } from './app/store/customer/customer.state';
import { ErrorLoggingState } from './app/store/error-logging/error-logging.state';
import { KeyboardState } from './app/store/keyboard/keyboard.state';
import { LanguageState } from './app/store/language/language.state';
import { ProductState } from './app/store/products/products.state';
import { ShippingState } from './app/store/shipping/shipping.state';
import { ThemeState } from './app/store/theme/theme.state';
import { UserProfileState } from './app/store/user-profile/user-profile.state';
import "@angular/compiler";

registerLocaleData(localeEn, 'en');
registerLocaleData(localePt, 'pt');

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

if (environment.production) {
  enableProdMode();
}

defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'en' },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: StrapiMedusaInterceptor,
    //   multi: true
    // },
    importProvidersFrom(
      IonicModule.forRoot({}),
      HttpClientModule,
      NgxStripeModule.forRoot(environment.STRIPE_KEY),
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
        defaultLanguage: 'en'
      }),
      NgxsModule.forRoot([
        EmailPasswordState,
        AuthState,

        ErrorLoggingState,
        CustomerState,
        KeyboardState,
        AddressesState,
        CustomerRegisterState,
        UserProfileState,
        ThemeState,
        ShippingState,
        ProductState,
        LanguageState,
        CartState
      ]),
      NgxsResetPluginModule.forRoot(),
      NgxsFormPluginModule.forRoot(),
      NgxsReduxDevtoolsPluginModule.forRoot({ disabled: false }),
      NgxsLoggerPluginModule.forRoot({ disabled: true }),
      NgxsStoragePluginModule.forRoot({
        key: [
          'authState',
          'emailPassword'
        ]
      }),
      IonicStorageModule.forRoot()
    ),
    provideRouter(routes),
  ],
});
