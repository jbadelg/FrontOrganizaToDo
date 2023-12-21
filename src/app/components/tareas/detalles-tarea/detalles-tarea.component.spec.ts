import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesTareaComponent } from './detalles-tarea.component';

describe('DetallesTareaComponent', () => {
  let component: DetallesTareaComponent;
  let fixture: ComponentFixture<DetallesTareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesTareaComponent]
    });
    fixture = TestBed.createComponent(DetallesTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
