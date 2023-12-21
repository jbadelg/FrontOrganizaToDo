import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesAmigoComponent } from './detalles-amigo.component';

describe('DetallesAmigoComponent', () => {
  let component: DetallesAmigoComponent;
  let fixture: ComponentFixture<DetallesAmigoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesAmigoComponent]
    });
    fixture = TestBed.createComponent(DetallesAmigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
