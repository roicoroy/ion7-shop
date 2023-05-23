import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import Validation from 'src/app/form-components/validators/validation';
import { IReqAuthRegister } from 'src/app/shared/types/requests/ReqAuthRegister';
import { IErrorRes } from 'src/app/shared/types/responses/AuthError';
import { EmailPasswordActions } from 'src/app/store/auth/email-password/email-password.actions';
import { scaleHeight } from 'src/app/shared/animations/animations';
import { KeypadModule } from 'src/app/shared/services/native/keyboard/keypad.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxsModule,
    KeypadModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ]
})
export class RegisterPage implements OnInit {

  // private facade = inject(HomePageFacade);
  // private facade = inject(HomePageFacade);

  registerReq: IReqAuthRegister;
  private store = inject(Store);

  public registerForm: UntypedFormGroup = new UntypedFormGroup({
    first_name: new UntypedFormControl('', [Validators.required]),
    last_name: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl(`${null}@test.com`, [
      Validators.required,
      Validators.email
    ]),
    username: new UntypedFormControl('test', [Validators.required]),
    password: new UntypedFormControl('Rwbento123!', [Validators.required]),
    passwordConfirmation: new UntypedFormControl('Rwbento123!', [Validators.required])
  },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  public error: IErrorRes;

  constructor() { }

  ngOnInit() {
  }
  public register(): void {
    console.log(this.registerForm.value);
    this.registerReq = this.registerForm.value;
    this.store.dispatch(new EmailPasswordActions.RegisterUser(this.registerReq))
  }
}
