import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Uebungen } from './uebungen';

describe('Uebungen', () => {
  let component: Uebungen;
  let fixture: ComponentFixture<Uebungen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Uebungen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Uebungen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
