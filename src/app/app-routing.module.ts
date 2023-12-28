import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio/inicio.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { ListarTareasComponent } from './components/tareas/listar-tareas/listar-tareas.component';
import { AuthGuard } from './auth.guard';
import { CrearTareaComponent } from './components/tareas/crear-tarea/crear-tarea.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegistroComponent
  },
  {
    path: 'listarTareas',
    component: ListarTareasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'crearTarea',
    component: CrearTareaComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
