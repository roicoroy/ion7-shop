import { Component, forwardRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormGroup, FormBuilder, ControlValueAccessor, Validators, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { matchingInputsValidator } from './validators';

export interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordFormComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordFormComponent implements ControlValueAccessor, OnDestroy {
  passwordForm: FormGroup | any;

  subscriptions: Subscription[] = [];

  get value(): PasswordFormValues {
    return this.passwordForm.value;
  }

  set value(value: PasswordFormValues) {
    this.passwordForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get passwordControl() {
    return this.passwordForm.controls.password;
  }

  get confirmPasswordControl() {
    return this.passwordForm.controls.confirmPassword;
  }

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: matchingInputsValidator('password', 'confirmPassword')
    });

    this.subscriptions.push(
      this.passwordForm.valueChanges.subscribe((value: any) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.passwordForm.reset();
    }
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.passwordForm.valid ? null : { passwords: { valid: false, }, };
  }

  reset() {
    this.passwordForm.reset();
  }
}
