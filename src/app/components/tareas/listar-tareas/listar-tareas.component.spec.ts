import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTareasComponent } from './listar-tareas.component';

describe('ListarTareasComponent', () => {
  let component: ListarTareasComponent;
  let fixture: ComponentFixture<ListarTareasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarTareasComponent]
    });
    fixture = TestBed.createComponent(ListarTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
