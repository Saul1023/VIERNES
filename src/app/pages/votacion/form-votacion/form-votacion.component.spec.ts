import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVotacionComponent } from './form-votacion.component';

describe('FormVotacionComponent', () => {
  let component: FormVotacionComponent;
  let fixture: ComponentFixture<FormVotacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormVotacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormVotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
