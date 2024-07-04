import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NBPApiService } from './services/nbpapi.service';
import { TableType } from './enums/table-type.enum';
import { FullCurrencyData } from './interfaces/FullCurrencyData.interface';
import { CurrencyDetails } from './interfaces/CurrencyDetails.interface';

import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  currencyRatesData: FullCurrencyData[] = [];
  destroySubscribe$: Subject<boolean> = new Subject<boolean>();
  calendarValue!: string;
  converterForm!: FormGroup;
  maxDate!: string;

  constructor(
    private NBPApiService: NBPApiService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchAllCurrency();
    this.currencyRatesDataValidation();
    this.fetchPreviousDay();
    this.fetchCurrencyFromDate(undefined, this.maxDate);
    this.initForm();
    this.checkCurrencyInputValue();
    this.calendarValue = this.maxDate;
  }

  fetchAllCurrency(): void {
    this.NBPApiService.fetchCurrentExchangeRates()
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe((data: FullCurrencyData[]) => {
        this.currencyRatesData = data;
        this.setSelectMenuWithValues(data);
        this.cdr.detectChanges();
      });
  }

  fetchCurrencyFromDate(table?: string, date?: string): void {
    const defaultTable = TableType.TABLE_A;
    const defaultDate = new Date().toJSON().slice(0, 10);

    this.NBPApiService.fetchCurrencyFromDate(
      table || defaultTable,
      date || defaultDate
    )
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe({
        next: (data: FullCurrencyData[]) => {
          this.setSelectMenuWithValues(data);
          this.currencyRatesData = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.currencyRatesData = [];
          this.cdr.detectChanges();
        },
      });
  }

  fetchPreviousDay(): void {
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);
    this.maxDate = this.format(yesterday.toISOString().split('T')[0]);
  }

  setSelectMenuWithValues(data: FullCurrencyData[]): void {
    const firstCurrencyElement = data[0]?.rates[0]?.code;

    this.converterForm.get('firstCombo')?.setValue(firstCurrencyElement);
    this.converterForm.get('secondCombo')?.setValue(firstCurrencyElement);
  }

  checkCurrencyInputValue(): void {
    this.converterForm
      .get('inputCurrency')
      ?.valueChanges.pipe(takeUntil(this.destroySubscribe$))
      .subscribe((value) => {
        if (!value) {
          this.converterForm.get('inputCurrency')?.markAsTouched();
          this.cdr.detectChanges();
        }
      });
  }

  checkCalendarData(): void {
    const dateFormat = this.format(this.calendarValue);

    this.fetchCurrencyFromDate(undefined, dateFormat);
  }

  format(value: string): string {
    const date = new Date(value);
    const day = this.dayAndMonthConvert(date.getDate());
    const month = this.dayAndMonthConvert(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  dayAndMonthConvert(value: number): string | number {
    return value > 10 ? value : `0${value}`;
  }

  private initForm(): void {
    this.converterForm = this.fb.group({
      inputCurrency: ['', [Validators.required, Validators.minLength(1)]],
      firstCombo: ['', Validators.required],
      secondCombo: ['', Validators.required],
    });
  }

  trackByCurrency(index: number, result: CurrencyDetails): string {
    return result?.mid;
  }

  currencyRatesDataValidation(): boolean {
    const shortenedValidation =
      this.currencyRatesData?.length > 0 &&
      this.currencyRatesData?.[0]?.rates?.length > 0;
    return shortenedValidation;
  }
}
