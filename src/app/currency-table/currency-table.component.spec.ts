import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyTableComponent } from './currency-table.component';
import { By } from '@angular/platform-browser';
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

  it('should return mid as trackBy value', () => {
    const currencyDetails = { mid: '4.567' } as any;
    const index = 0;
    expect(component.trackByCurrency(index, currencyDetails)).toBe('4.567');
  });

  it('should validate currency data correctly', () => {
    component.currencyData = [
      {
        rates: [{ currency: 'USD', country: 'USD', code: 'USD', mid: '3.75' }],
      },
    ] as FullCurrencyData[];
    expect(component.currencyRatesDataValidation()).toBe(true);

    component.currencyData = [];
    expect(component.currencyRatesDataValidation()).toBe(false);

    component.currencyData = [{} as any];
    expect(component.currencyRatesDataValidation()).toBe(false);
  });
});
