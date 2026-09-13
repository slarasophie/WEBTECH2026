import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UebungenLoeschen } from './uebungen-loeschen';

describe('UebungenLoeschen', () => {
  let component: UebungenLoeschen;
  let fixture: ComponentFixture<UebungenLoeschen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UebungenLoeschen],
    }).compileComponents();

    fixture = TestBed.createComponent(UebungenLoeschen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
