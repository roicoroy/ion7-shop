import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { EmailPasswordActions } from 'src/app/store/auth/email-password/email-password.actions';
import { IReqForgotPassword } from 'src/app/shared/types/requests/ReqForgotPassword';
import { KeypadModule } from 'src/app/shared/services/native/keyboard/keypad.module';
import { scaleHeight } from 'src/app/shared/animations/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
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
    KeypadModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ]
})
export class ForgotPasswordPage {

  private store = inject(Store);

  public formGroup: FormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email])
  });

  resetPasswordBind: IReqForgotPassword;

  public error: any;

  public requestForgotPassword(): void {
    this.resetPasswordBind = this.formGroup.get('email').value;
    this.store.dispatch(new EmailPasswordActions.ForgotPassword(this.resetPasswordBind))
  }
}
