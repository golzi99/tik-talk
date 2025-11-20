import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TtInputComponent } from '@tt/common-ui';
import { AddressSuggestion, DadataService } from '@tt/data-access/dadata-api';
import { debounceTime, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'tt-address-input',
  imports: [TtInputComponent, ReactiveFormsModule, AsyncPipe],
  standalone: true,
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent),
    },
  ],
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl();
  #dadataService = inject(DadataService);

  isDropDownOpened = signal<boolean>(false);

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
    flat: new FormControl(''),
  });

  suggestions$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap(val => {
      return this.#dadataService.getSuggestion(val).pipe(
        tap(value => {
          this.isDropDownOpened.set(!!value.length);
        })
      );
    })
  );

  writeValue(val: string): void {
    const splitVal = val
      ? val.split(' ').map(val => {
          return val.split('.')[1];
        })
      : [];
    this.innerSearchControl.patchValue(val, {
      emitEvent: false,
    });
    this.addressForm.patchValue({
      city: splitVal[0] || '',
      street: splitVal[1] || '',
      building: splitVal[2] || '',
      flat: splitVal[3] || '',
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  onChange(value: string | null) {}

  onTouched() {}

  onSuggestionPick(suggest: AddressSuggestion) {
    const fullAddress = `г.${suggest.data.city} ул.${suggest.data.street} д.${suggest.data.house} кв.${suggest.data.flat}`;
    this.isDropDownOpened.set(false);
    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      building: suggest.data.house,
      flat: suggest.data.flat,
    });
    this.innerSearchControl.patchValue(
      `г.${suggest.data.city} ул.${suggest.data.street} д.${suggest.data.house} кв.${suggest.data.flat}`,
      {
        emitEvent: false,
      }
    );
    this.onChange(fullAddress);
  }
}
