import { Component, forwardRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormGroup, FormBuilder, ControlValueAccessor, NG_VALIDATORS, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

export interface GuestFormValues {
  email: string;
}

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GuestFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GuestFormComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestFormComponent implements ControlValueAccessor, OnDestroy {

  guestForm: FormGroup | any;

  subscriptions: Subscription[] = [];

  get value(): GuestFormValues {
    return this.guestForm.value;
  }

  set value(value: GuestFormValues) {
    this.guestForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get guestControl() {
    return this.guestForm.controls.email;
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    public store: Store,
  ) {
    this.guestForm = this.formBuilder.group({
      email: new FormControl('crazyemail@email.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])), updateOn: "blur",
    });

    this.subscriptions.push(
      this.guestForm.valueChanges.subscribe((value: any) => {
        this.onChange(value);
        this.onTouched();
      })
    );
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
      this.guestForm.reset();
    }
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.guestForm.valid ? null : { passwords: { valid: false, }, };
  }

  reset() {
    this.guestForm.reset();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
