import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Address, Features, MockService } from '../mockService/mockService';
import { KeyValuePipe } from '@angular/common';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

function getAddressForm(initialValues: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValues.city ?? ''),
    street: new FormControl<string>(initialValues.street ?? ''),
    building: new FormControl<number | null>(initialValues.building ?? null),
    apartment: new FormControl<number | null>(initialValues.apartment ?? null),
  });
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return control => {
    return control.value.startsWith(forbiddenLetter)
      ? { startsWith: { message: `${forbiddenLetter} запретная буква алфавита` } }
      : null;
  };
}

@Component({
  selector: 'app-forms-experimental',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './form-experimental.component.html',
  styleUrl: './form-experimental.component.scss',
})
export class FormsExperimentalComponent {
  mockService = inject(MockService);
  features: Features[] = [];

  ReceiverType = ReceiverType;

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    name: new FormControl<string>('', [Validators.required, validateStartWith('м')]),
    inn: new FormControl<number | null>(null),
    lastName: new FormControl<string>(''),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup({
      from: new FormControl<string>(''),
      to: new FormControl<string>(''),
    }),
  });

  constructor() {
    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addrs => {
        // while (this.form.controls.addresses.controls.length > 0) {
        //   this.form.controls.addresses.removeAt(0);
        // }

        this.form.controls.addresses.clear();

        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr));
        }

        // this.form.controls.addresses.setControl(1, getAddressForm(addrs[0]))
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe(features => {
        this.features = features;

        for (const feature of features) {
          if (feature.code != null) {
            this.form.controls.feature.addControl(feature.code, new FormControl(feature.value));
          }
        }
      });

    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed()).subscribe(val => {
      this.form.controls.inn.clearValidators();
      if (val === ReceiverType.LEGAL) {
        this.form.controls.inn.setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]);
      }
      this.form.controls.inn.updateValueAndValidity();
    });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;
    console.log(this.form.valid);
    console.log(this.form.value);
  }

  addAddress() {
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  deleteAddress(idx: number) {
    this.form.controls.addresses.removeAt(idx, { emitEvent: false });
  }

  sort = () => 0;
}
