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
import { AddressPipe, TtInputComponent } from '@tt/common-ui';
import { AddressSuggestion, DadataService } from '@tt/data-access/dadata-api';
import { debounceTime, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tt-address-input',
  imports: [TtInputComponent, ReactiveFormsModule, AsyncPipe, AddressPipe],
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
    const parsed = this.parseAddressString(val);
    this.addressForm.patchValue(parsed, { emitEvent: false });
    this.innerSearchControl.patchValue(val, { emitEvent: false });
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
    this.isDropDownOpened.set(false);
    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      building: suggest.data.house,
      flat: suggest.data.flat,
    });
    this.innerSearchControl.patchValue(
      this.composeAddressString(this.addressForm),
      {
        emitEvent: false,
      }
    );
    this.onChange(this.composeAddressString(this.addressForm));
  }

  constructor() {
    this.addressForm.valueChanges
      .pipe(debounceTime(200), takeUntilDestroyed())
      .subscribe(value => {
        const newString = this.composeAddressString(this.addressForm);
        this.innerSearchControl.patchValue(newString, { emitEvent: false });
        this.onChange(newString);
      });
  }

  private composeAddressString(form: FormGroup): string {
    const city = form.value.city ? `г.${form.value.city}` : '';
    const street = form.value.street ? ` ул.${form.value.street}` : '';
    const building = form.value.building ? ` д.${form.value.building}` : '';
    const flat = form.value.flat ? ` кв.${form.value.flat}` : '';

    return `${city}${street}${building}${flat}`.trim();
  }

  private parseAddressString(value: string | null) {
    if (!value) return { city: '', street: '', building: '', flat: '' };

    const city = value.match(/г\.(.+?)(?=\sул\.|$)/)?.[1]?.trim() ?? '';
    const street = value.match(/ул\.(.+?)(?=\sд\.|$)/)?.[1]?.trim() ?? '';
    const building = value.match(/д\.(.+?)(?=\sкв\.|$)/)?.[1]?.trim() ?? '';
    const flat = value.match(/кв\.(.+)$/)?.[1]?.trim() ?? '';

    return { city, street, building, flat };
  }
}
