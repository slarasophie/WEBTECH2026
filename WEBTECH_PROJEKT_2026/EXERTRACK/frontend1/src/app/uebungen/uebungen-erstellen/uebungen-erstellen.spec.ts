import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UebungenErstellen } from './uebungen-erstellen';

describe('UebungenErstellen', () => {
  let component: UebungenErstellen;
  let fixture: ComponentFixture<UebungenErstellen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UebungenErstellen],
    }).compileComponents();

    fixture = TestBed.createComponent(UebungenErstellen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
