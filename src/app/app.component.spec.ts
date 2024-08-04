import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NBPApiService } from './services/nbpapi.service';
import { of, throwError } from 'rxjs';
import { FullCurrencyData } from './interfaces/FullCurrencyData.interface';
import { CurrencyTableComponent } from './currency-table/currency-table.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from './environment/environment';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: NBPApiService;
  let exampleData: FullCurrencyData[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [AppComponent, CurrencyTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(NBPApiService);

    exampleData = [
      {
        rates: [
          {
            code: 'USD',
            currency: 'Dolar amerykański',
            country: 'USA',
            mid: '2.2',
          },
        ],
      },
    ] as FullCurrencyData[];

    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should generate form value with default values', () => {
    const formValue = component.converterForm?.value;
    const exampleForm = {
      inputCurrency: '',
      firstCombo: '',
      secondCombo: '',
    };

    expect(formValue).toEqual(exampleForm);
  });

  it('call fetchAllCurrency method', () => {
    spyOn(service, 'fetchCurrentExchangeRates').and.callFake(() => {
      return of(exampleData);
    });
    const comboMenu = spyOn(
      component,
      'setSelectMenuWithValues'
    ).and.returnValue();
    component.currencyRatesData = [];
    component.fetchAllCurrency();
    expect(component.currencyRatesData).toEqual(exampleData);
    expect(comboMenu).toHaveBeenCalled();
    expect(comboMenu).toHaveBeenCalledWith(exampleData);
    expect(comboMenu).toHaveBeenCalledTimes(1);
  });

  it('should return values from fetchCurrencyFromDate method with given parameters', () => {
    let table = 'A';
    let date = '2024-07-24';

    const fetchCurrencyFromDateService = spyOn(
      service,
      'fetchCurrencyFromDate'
    ).and.callFake(() => {
      return of(exampleData);
    });

    const setSelectMenuWithValues = spyOn(
      component,
      'setSelectMenuWithValues'
    ).and.returnValue();

    component.fetchCurrencyFromDate(table, date);
    expect(fetchCurrencyFromDateService).toHaveBeenCalledWith(table, date);
    expect(setSelectMenuWithValues).toHaveBeenCalledWith(exampleData);
    expect(component.currencyRatesData).toBe(exampleData);
  });

  it('should return values from fetchCurrencyFromDate method without given parameters', () => {
    let table = 'A';
    const defaultDate = new Date().toJSON().slice(0, 10);

    const fetchCurrencyFromDateService = spyOn(
      service,
      'fetchCurrencyFromDate'
    ).and.callFake(() => {
      return of(exampleData);
    });
    component.fetchCurrencyFromDate();
    expect(fetchCurrencyFromDateService).toHaveBeenCalledWith(
      table,
      defaultDate
    );
  });

  it('should handle error correctly when fetchCurrencyFromDate fails', () => {
    let httpTestingController: HttpTestingController;
    httpTestingController = TestBed.inject(HttpTestingController);
    component.fetchCurrencyFromDate();

    const x = spyOn(service, 'fetchCurrencyFromDate').and.returnValue(
      throwError(() => new Error('Error'))
    );

    expect(component.currencyRatesData).toEqual([]);
  });

  it("should set maxDate to yesterday's date in YYYY-MM-DD format", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const expectedDate = yesterday.toISOString().split('T')[0];

    component.fetchPreviousDay();

    expect(component.maxDate).toBe(expectedDate);
  });

  it('should return values from server', () => {
    const exampleDataLength = exampleData?.length > 0;
    const exampleDataRatesLength = exampleData?.[0]?.rates?.length > 0;

    expect(exampleDataLength).toBe(true);
    expect(exampleDataRatesLength).toBe(true);
  });

  it('should return empty array from server', () => {
    const currencyRatesData = (component.currencyRatesData = []);
    const exampleDataLength = currencyRatesData?.length > 0;
    expect(exampleDataLength).toBe(false);
  });
});
