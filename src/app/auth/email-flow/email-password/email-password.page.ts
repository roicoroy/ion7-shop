import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, ViewChild, inject, OnDestroy } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, Platform } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { LoginFormComponent } from "src/app/form-components/components/login-form/login-form.component";
import { Observable, Subject, takeUntil } from "rxjs";
import { scaleHeight } from "src/app/shared/animations/animations";
import { KeypadModule } from "src/app/shared/services/native/keyboard/keypad.module";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";
import { IStrapiLoginData } from "src/app/shared/types/types.interfaces";
import { EmailPasswordActions } from "src/app/store/auth/email-password/email-password.actions";
import { EmailPasswordFacade, IEmailPasswordFacadeState } from "./email-password.facade";
import { FormComponentsModule } from "src/app/form-components/form-components.module";
import { UtilityService } from "src/app/shared/services/utility/utility.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-email-password',
  templateUrl: './email-password.page.html',
  styleUrls: ['./email-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    ReactiveFormsModule,
    FormComponentsModule,
    KeypadModule
  ]
})
export class EmailPasswordPage implements OnDestroy {
  @ViewChild('form') form: LoginFormComponent;

  loginReq: IStrapiLoginData;

  viewState$: Observable<IEmailPasswordFacadeState>;

  private platform = inject(Platform);
  private store = inject(Store);
  private navigation = inject(NavigationService);

  private utility = inject(UtilityService);
  private facade = inject(EmailPasswordFacade);
  private cookieService = inject(CookieService);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (vs) => {
        if (vs.isLoggedIn) {
          await this.utility.presentLoading('...');
          setTimeout(async () => {
            // this.navigation.navControllerDefault('start/tabs/home');
            await this.utility.dismissLoading();
          }, 1000);
        }
      });
  }

  ionViewDidEnter() {
    this.form?.loginForm.get('email').setValue("roicoroy@yahoo.com.br");
    this.form?.loginForm.get('password').setValue("Rwbento123!");
    const all_cookies = this.cookieService.getAll();
    console.log(all_cookies );
  }

  login() {
    this.store.dispatch(new EmailPasswordActions.LoginEmailPassword(this.form?.loginForm.get('email').value, this.form?.loginForm.get('password').value));
  }
  forgotPassowordPage(): void {
    this.navigation.navControllerDefault('auth/pages/email/flow/forgot-password');
  }
  registerPage(): void {
    this.navigation.navControllerDefault('/auth/pages/email/flow/register');
  }
  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Inbox' : '';
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
