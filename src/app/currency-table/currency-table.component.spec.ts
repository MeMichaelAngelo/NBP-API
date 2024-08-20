import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTableComponent } from './currency-table.component';
import { FullCurrencyData } from '../interfaces/FullCurrencyData.interface';

describe('CurrencyTableComponent', () => {
  let component: CurrencyTableComponent;
  let fixture: ComponentFixture<CurrencyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert Polish characters', () => {
    const text = 'Łódź';
    const converted = component.convertPolishChars(text);
    expect(converted).toBe('Lodz');
  });

  it('should validate currency data correctly', () => {
    component.currencyData = [
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
    expect(component.currencyRatesDataValidation()).toBe(true);
  });

  it('should validate currency data incorrectly', () => {
    component.currencyData = [];
    expect(component.currencyRatesDataValidation()).toBe(false);
  });
});
