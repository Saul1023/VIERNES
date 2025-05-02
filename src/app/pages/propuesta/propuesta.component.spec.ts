import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropuestaComponent } from './propuesta.component';

describe('PropuestaComponent', () => {
  let component: PropuestaComponent;
  let fixture: ComponentFixture<PropuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
