import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrearAmigoComponent } from './components/amigos/crear-amigo/crear-amigo.component';
import { DetallesAmigoComponent } from './components/amigos/detalles-amigo/detalles-amigo.component';
import { ListarAmigosComponent } from './components/amigos/listar-amigos/listar-amigos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarContrasenaComponent } from './components/auth/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { CrearCategoriaComponent } from './components/categorias/crear-categoria/crear-categoria.component';
import { ListarCategoriasComponent } from './components/categorias/listar-categorias/listar-categorias.component';
import { InicioComponent } from './components/inicio/inicio/inicio.component';
import { CrearTareaComponent } from './components/tareas/crear-tarea/crear-tarea.component';
import { DetallesTareaComponent } from './components/tareas/detalles-tarea/detalles-tarea.component';
import { EditarTareaComponent } from './components/tareas/editar-tarea/editar-tarea.component';
import { ListarTareasComponent } from './components/tareas/listar-tareas/listar-tareas.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HttpClientModule} from "@angular/common/http";
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    CrearAmigoComponent,
    DetallesAmigoComponent,
    ListarAmigosComponent,
    LoginComponent,
    RecuperarContrasenaComponent,
    RegistroComponent,
    CrearCategoriaComponent,
    ListarCategoriasComponent,
    InicioComponent,
    CrearTareaComponent,
    DetallesTareaComponent,
    EditarTareaComponent,
    ListarTareasComponent,
    FooterComponent,
    HeaderComponent,
    SidenavComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatIconModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
