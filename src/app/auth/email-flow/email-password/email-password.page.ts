import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, ViewChild, inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, Platform } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { Observable, Subject, Subscription, takeUntil } from "rxjs";
import { scaleHeight } from "src/app/shared/animations/animations";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";
import { IStrapiLoginData } from "src/app/shared/types/types.interfaces";
import { EmailPasswordActions } from "src/app/store/auth/email-password/email-password.actions";
import { EmailPasswordFacade, IEmailPasswordFacadeState } from "./email-password.facade";
import { UtilityService } from "src/app/shared/services/utility/utility.service";

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
    ReactiveFormsModule,
    TranslateModule,
    NgxsModule,
    ReactiveFormsModule,
  ]
})
export class EmailPasswordPage implements OnDestroy, OnDestroy {

  loginForm: FormGroup | any;

  subscriptions: Subscription[] = [];

  loginReq: IStrapiLoginData;

  viewState$: Observable<IEmailPasswordFacadeState>;

  private platform = inject(Platform);

  private store = inject(Store);

  private formBuilder = inject(FormBuilder);
  private navigation = inject(NavigationService);
  private utility = inject(UtilityService);
  private facade = inject(EmailPasswordFacade);

  subscription = new Subject();
  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (vs) => {
        await this.utility.presentLoading('...');
        console.log(vs);
        if (vs.isLoggedIn) {
          this.navigation.navControllerDefault('/start/tabs/home');
          await this.utility.dismissLoading();
        } else {
          await this.utility.dismissLoading();
        }
      });
    this.loginForm = this.formBuilder.group({
      email: new FormControl('roicoroy@yahoo.com.br'),
      password: new FormControl('Rwbento123!'),
    });
  }
  async login(): Promise<void> {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    console.log(email, password);
    this.store.dispatch(new EmailPasswordActions.LoginEmailPassword(email, password));
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
    this.subscription.next(null);
    this.subscription.complete();
  }

}
