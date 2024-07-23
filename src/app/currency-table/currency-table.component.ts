import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FullCurrencyData } from '../interfaces/FullCurrencyData.interface';
import { polishCharsMap } from '../consts/polishChars.const';
import { CurrencyDetails } from '../interfaces/CurrencyDetails.interface';

@Component({
  selector: 'app-currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyTableComponent {
  @Input() currencyData: FullCurrencyData[] = [];

  convertPolishChars(text: string): string {
    return text.replace(
      /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
      (match) => polishCharsMap[match] || match
    );
  }

  trackByCurrency(index: number, result: CurrencyDetails): string {
    return result?.mid;
  }

  currencyRatesDataValidation(): boolean {
    const shortenedCurrencyDataValidation =
      this.currencyData?.length > 0 &&
      this.currencyData?.[0]?.rates?.length > 0;
    return shortenedCurrencyDataValidation;
  }
}
