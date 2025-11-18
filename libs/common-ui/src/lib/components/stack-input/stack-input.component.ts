import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
} from '@angular/core';
import { SvgIcon } from '@tt/common-ui';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'tt-stack-input',
  imports: [SvgIcon, FormsModule, AsyncPipe],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StackInputComponent),
    },
  ],
})
export class StackInputComponent implements ControlValueAccessor {
  value$ = new BehaviorSubject<string[]>([]);
  #disabled = false;
  innerInput = '';

  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.#disabled;
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.innerInput) return;
    this.value$.next([...this.value$.value, this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value$.value);
  }

  writeValue(stack: string[] | null): void {
    if (!stack) {
      this.value$.next([]);
      return;
    }
    this.value$.next(stack);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.#disabled = isDisabled;
  }

  onChange(value: string[] | null) {}

  onTouched() {}

  onTagDelete(index: number): void {
    const tags = [...this.value$.value];
    tags.splice(index, 1);
    this.value$.next(tags);
    this.onChange(this.value$.value);
  }
}
