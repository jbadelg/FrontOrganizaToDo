import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAmigoComponent } from './crear-amigo.component';

describe('CrearAmigoComponent', () => {
  let component: CrearAmigoComponent;
  let fixture: ComponentFixture<CrearAmigoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearAmigoComponent]
    });
    fixture = TestBed.createComponent(CrearAmigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
