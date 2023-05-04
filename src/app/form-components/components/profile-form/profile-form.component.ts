import { Component, forwardRef, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup, Validators, FormControl, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface ProfileFormValues {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface ProfileFormState {
  isCustomerLoggedIn: boolean;
}

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: [
    './profile-form.component.scss',
    './styles/contact-card.page.scss',
    './styles/contact-card.shell.scss'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProfileFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProfileFormComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent implements ControlValueAccessor, OnDestroy {

  @Input() set profileData(value: ProfileFormValues | any) {
    // console.log(value?.user);
    this._formValues = {
      first_name: value?.user?.first_name ? value?.user?.first_name : '',
      last_name: value?.user?.last_name ? value?.user?.last_name : '',
      email: value?.user?.email ? value?.user?.email : '',
      phone: value?.user?.phone ? value?.user?.phone : '',
    }
    this.profileForm.get('username').setValue(this.formValues?.username);
    this.profileForm.get('first_name').setValue(this.formValues?.first_name || null);
    this.profileForm.get('last_name').setValue(this.formValues?.last_name || null);
    this.profileForm.get('email').setValue(this.formValues?.email);
    this.profileForm.get('phone').setValue(this.formValues?.phone);

    this._isLoggedIn = value.isUserLoggedIn && value.isCustomerLoggedIn ? true : false;
  };
  get formValues(): any {
    return this._formValues;
  }
  private _formValues: ProfileFormValues;
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  private _isLoggedIn: boolean;
  //
  profileForm: FormGroup | any;

  subscriptions: Subscription[] = [];

  onChange: any = () => { };
  onTouched: any = () => { };

  get value(): ProfileFormValues {
    return this.profileForm.value;
  }

  set value(value: ProfileFormValues) {
    this.profileForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get emailControl() {
    return this.profileForm.controls.email;
  }
  get firstNameControl() {
    return this.profileForm.controls.first_name
  }
  get lastNameControl() {
    return this.profileForm.controls.last_name;
  }

  constructor(
    private formBuilder: FormBuilder
  ) {

    this.profileForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
    });

    this.subscriptions.push(
      this.profileForm.valueChanges.subscribe((value: any) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.profileForm.reset();
    }
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.profileForm.valid ? null : { profile: { valid: false, }, };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
