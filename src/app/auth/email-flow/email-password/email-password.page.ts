import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { scaleHeight } from "src/app/shared/animations/animations";
import { KeypadModule } from "src/app/shared/services/native/keyboard/keypad.module";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";
import { IStrapiLoginData } from "src/app/shared/types/types.interfaces";
import { EmailPasswordFacade, IEmailPasswordFacadeState } from "./email-password.facade";
import { AppRoutePath } from "src/app/app.routers.model";
import { NgxsFormPluginModule, UpdateFormValue } from "@ngxs/form-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";

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
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule,
    KeypadModule
  ]
})
export class EmailPasswordPage implements OnDestroy {
  loginForm: FormGroup;

  loginReq: IStrapiLoginData;

  viewState$: Observable<IEmailPasswordFacadeState>;

  private navigation = inject(NavigationService);

  private facade = inject(EmailPasswordFacade);
  
  private store = inject(Store);
  
  private formBuilder = inject(FormBuilder);

  private readonly ngUnsubscribe = new Subject();

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ]
  };
  constructor() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
    });
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (vs) => {
        console.log(vs);
        if (vs.isLoggedIn) {
          // await this.utility.presentLoading('...');
          setTimeout(async () => {
            this.navigation.navControllerDefault('start/tabs/home');
            // await this.utility.dismissLoading();
          }, 1000);
        }
      });
  }

  ionViewDidEnter() {
    this.store.dispatch([
      new UpdateFormValue({
        path: 'emailPassword.loginForm',
        value: {
          email: 'roicoroy@yahoo.com.br',
          password: 'Rwbento123!',
        },
      }),
    ]);
  }

  login(): void {
    this.facade.loginWithEmail(this.loginForm.get('email').value, this.loginForm.get('password').value);
  }
  forgotPasswordPage(): void {
    this.navigation.navControllerDefault(AppRoutePath.AUTH_FORGOT_PASSWORD);
  }
  registerPage(): void {
    this.navigation.navControllerDefault(AppRoutePath.AUTH_REGISTER);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
