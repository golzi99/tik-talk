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
import { DateTime } from 'luxon';
import { NameValidator } from '../name.validator';
import { MaskitoOptions, MaskitoPreprocessor } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';
import {
  maskitoAddOnFocusPlugin,
  maskitoCaretGuard,
  maskitoPrefixPostprocessorGenerator,
  maskitoRemoveOnBlurPlugin,
} from '@maskito/kit';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

const phoneRegex = [
  '+',
  '7',
  ' ',
  '(',
  /\d/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

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

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}): ValidatorFn {
  return control => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = DateTime.fromISO(fromControl.value);
    const toDate = DateTime.fromISO(toControl.value);

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({
        dateRange: { message: 'Дата начала не может быть позднее даты конца' },
      });
      return { dateRange: { message: 'Дата начала не может быть позднее даты конца' } };
    }

    return null;
  };
}

function createCompletePhoneInsertionPreprocessor(): MaskitoPreprocessor {
  const trimPrefix = (value: string): string => value.replace(/^(\+?7?\s?8?)\s?/, '');
  const countDigits = (value: string): number => value.replaceAll(/\D/g, '').length;

  return ({ elementState, data }) => {
    const { value, selection } = elementState;

    return {
      elementState: {
        selection,
        value: countDigits(value) > 11 ? trimPrefix(value) : value,
      },
      data: countDigits(data) >= 11 ? trimPrefix(data) : data,
    };
  };
}

@Component({
  selector: 'app-forms-experimental',
  imports: [ReactiveFormsModule, KeyValuePipe, MaskitoDirective],
  templateUrl: './form-experimental.component.html',
  styleUrl: './form-experimental.component.scss',
})
export class FormsExperimentalComponent {
  mockService = inject(MockService);
  nameValidator = inject(NameValidator);
  features: Features[] = [];
  readonly maskitoOptions: MaskitoOptions = {
    mask: phoneRegex,
    postprocessors: [maskitoPrefixPostprocessorGenerator('+7 ')],
    plugins: [
      maskitoAddOnFocusPlugin('+7 '),
      maskitoRemoveOnBlurPlugin('+7 '),
      maskitoCaretGuard((value, [from, to]) => [from === to ? '+7 '.length : 0, value.length]),
    ],
    preprocessors: [createCompletePhoneInsertionPreprocessor()],
  };

  ReceiverType = ReceiverType;

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    name: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur',
    }),
    inn: new FormControl<number | null>(null),
    lastName: new FormControl<string>(''),
    phoneNumber: new FormControl<string>(''),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),
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
