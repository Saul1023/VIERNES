import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCronogramaComponent } from './form-cronograma.component';

describe('FormCronogramaComponent', () => {
  let component: FormCronogramaComponent;
  let fixture: ComponentFixture<FormCronogramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCronogramaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCronogramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
