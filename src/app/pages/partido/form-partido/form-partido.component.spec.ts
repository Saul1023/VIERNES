import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPartidoComponent } from './form-partido.component';

describe('FormPartidoComponent', () => {
  let component: FormPartidoComponent;
  let fixture: ComponentFixture<FormPartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPartidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
