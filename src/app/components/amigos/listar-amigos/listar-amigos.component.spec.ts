import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAmigosComponent } from './listar-amigos.component';

describe('ListarAmigosComponent', () => {
  let component: ListarAmigosComponent;
  let fixture: ComponentFixture<ListarAmigosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarAmigosComponent]
    });
    fixture = TestBed.createComponent(ListarAmigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
