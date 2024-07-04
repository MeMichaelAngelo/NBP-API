import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FullCurrencyData } from '../interfaces/FullCurrencyData.interface';
import { CurrencyDetails } from '../interfaces/CurrencyDetails.interface';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent implements OnInit {
  @Input() currencyRatesData: FullCurrencyData[] = [];
  @Input() form!: FormGroup;

  ngOnInit(): void {
    this.currencyRatesDataValidation();
  }

  currencyRatesDataValidation(): boolean {
    const shortenedValidation =
      this.currencyRatesData?.length > 0 &&
      this.currencyRatesData?.[0]?.rates?.length > 0;
    return shortenedValidation;
  }

  convertCurrency(): number {
    if (!this.currencyRatesData) return 0;

    const firstComboValue = this.currencyRatesData[0].rates.find(
      (el: CurrencyDetails) => el.code === this.form.get('firstCombo')?.value
    )?.mid;
    const secondComboValue = this.currencyRatesData[0].rates.find(
      (el: CurrencyDetails) => el.code === this.form.get('secondCombo')?.value
    )?.mid;

    return (
      (this.form.get('inputCurrency')?.value * Number(firstComboValue)) /
      Number(secondComboValue)
    );
  }

  trackByCurrency(index: number, result: CurrencyDetails): string {
    return result?.mid;
  }

  trackByCurrencyCode(index: number, currency: CurrencyDetails): string {
    return currency?.code;
  }
}
