import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExercises } from './add-exercises';

describe('AddExercises', () => {
  let component: AddExercises;
  let fixture: ComponentFixture<AddExercises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExercises],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExercises);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
