import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule, UpdateFormValue } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { IReqAuthRegister } from 'src/app/shared/types/requests/ReqAuthRegister';
import { IErrorRes } from 'src/app/shared/types/responses/AuthError';
import { EmailPasswordActions } from 'src/app/store/auth/email-password/email-password.actions';
import { scaleHeight } from 'src/app/shared/animations/animations';
import { KeypadModule } from 'src/app/shared/services/native/keyboard/keypad.module';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import Validation from 'src/app/shared/utils/validation';

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
    NgxsStoragePluginModule,
  ]
})
export class RegisterPage implements OnInit {

  registerReq: IReqAuthRegister;

  private store = inject(Store);
  private navigation = inject(NavigationService);

  public error: IErrorRes;

  public registerForm: FormGroup = new FormGroup({
    first_name: new FormControl(null, [Validators.required]),
    last_name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl('Rwbento123!', [Validators.required]),
    passwordConfirmation: new FormControl('Rwbento123!', [Validators.required])
  }, { validators: [Validation.match('password', 'passwordConfirmation')] }
  );

  ionViewDidEnter() {
    this.store.dispatch([
      new UpdateFormValue({
        path: 'emailPassword.registerForm',
        value: {
          email: 'roicoroy@yahoo.com.br',
          first_name: 'First Name',
          last_name: 'Fast_ Name',
          username: 'username'
        },
      }),
    ]);
  }

  ngOnInit() {
  }

  register(): void {
    this.registerReq = this.registerForm.value;
    this.store.dispatch(new EmailPasswordActions.RegisterUser(this.registerForm.value))
  }
}
