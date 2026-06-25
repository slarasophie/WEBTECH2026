import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Impresum } from './impresum';

describe('Impresum', () => {
  let component: Impresum;
  let fixture: ComponentFixture<Impresum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Impresum],
    }).compileComponents();

    fixture = TestBed.createComponent(Impresum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
