import { CurrencyDetails } from './CurrencyDetails.interface';

export interface FullCurrencyData {
  effectiveDate: string;
  no: string;
  rates: CurrencyDetails[];
  table: string;
}
