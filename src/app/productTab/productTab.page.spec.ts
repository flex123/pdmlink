import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTabPage } from './productTab.page';

describe('Tab1Page', () => {
  let component: ProductTabPage;
  let fixture: ComponentFixture<ProductTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
