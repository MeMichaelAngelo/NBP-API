import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { CurrencyConverterComponent } from './currency-converter.component';
import { FullCurrencyData } from '../interfaces/FullCurrencyData.interface';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CurrencyConverterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate currencyRatesDataValidation method correctly', () => {
    component.currencyRatesData = [
      {
        rates: [
          {
            currency: 'Dolar amerykański',
            country: 'USA',
            code: 'USD',
            mid: '3.75',
          },
        ],
      },
    ] as FullCurrencyData[];

    expect(component.currencyRatesDataValidation()).toBeTrue();
  });

  it('should return false when currencyRatesData has no data', () => {
    component.currencyRatesData = [];
    expect(component.currencyRatesDataValidation()).toBeFalse();
  });

  it('should convert data correctly', () => {
    formBuilder = TestBed.inject(FormBuilder);

    component.form = formBuilder.group({
      firstCombo: 'USD',
      secondCombo: 'CHF',
      inputCurrency: 1,
    });

    component.currencyRatesData = [
      {
        rates: [
          {
            code: 'USD',
            currency: 'Dolar amerykański',
            country: 'USA',
            mid: '2.2',
          },
          {
            code: 'CHF',
            currency: 'Frank szwajcarski',
            country: 'Szwajcaria',
            mid: '2',
          },
        ],
      },
    ] as FullCurrencyData[];

    const result = component.convertCurrency();
    expect(result).toBe(1.1);
  });

  it('should return 0 if currencyRatesData has no data', () => {
    component.currencyRatesData = [];
    expect(component.convertCurrency()).toBe(0);
  });
});
