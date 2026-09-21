import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registrieren } from './registrieren';

describe('Registrieren', () => {
  let component: Registrieren;
  let fixture: ComponentFixture<Registrieren>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registrieren]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registrieren);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
