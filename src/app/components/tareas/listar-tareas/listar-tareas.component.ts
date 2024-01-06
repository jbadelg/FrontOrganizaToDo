import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { TareaServiceService } from 'src/app/services/tarea-service.service';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TareaDTO } from 'src/app/Models/tarea.dto';
import { UserServiceService } from 'src/app/services/user-service.service';
import { forkJoin, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-tareas',
  templateUrl: './listar-tareas.component.html',
  styleUrls: ['./listar-tareas.component.scss']
})
export class ListarTareasComponent implements OnInit {
  listaTareas: any[] = [];
  listaTareasRta: TareaDTO[] = [];
  isResLoaded = false;
  categoryId: string | null;
  selectedOptions: string;
  verFinalizadas: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tareaService: TareaServiceService,
    private userService: UserServiceService,
    private sharedService: FeedbackService,
    private categoriaService: CategoriaServiceService
  ) {
      this.categoryId = null;
      this.selectedOptions = '';
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((parms: ParamMap) => {
      this.categoryId = parms.get("id");
      if (this.categoryId) {
        this.getFiltredTasks(this.categoryId);
      } else {
        this.getAllTasks();
      }
    });

  }
  getAllTasks() {
    this.isResLoaded = true;

    this.userService.getUserTasks().pipe(
      mergeMap(tasks => {
        const observables = tasks.map(task => {
          const categoriaId = task.categoria_id;
          return this.categoriaService.getCategoryById(categoriaId);
        });

        return forkJoin(observables).pipe(
          catchError(error => {
            console.error('Error al obtener las categorías:', error);
            return of([]); // Devuelve un observable vacío en caso de error
          }),
          // Combina las tareas con las categorías
          mergeMap(categorias => {
            tasks.forEach((task, index) => {
              task.categoria_nombre = categorias[index].data.categoria_nombre;
              task.categoria_color = categorias[index].data.categoria_color;
              console.log("colores " + task.categoria_color);
            });
            this.listaTareas = tasks;
            this.isResLoaded = false;
            // Emite las tareas actualizadas
            return of(this.listaTareas);
          })
        );
      })
    ).subscribe(
      tareas => {
        // Puedes hacer algo con las tareas si es necesario
      },
      error => {
        console.error('Error al obtener las tareas:', error);
        this.isResLoaded = false;
      }
    );
  }
  getAllTasks1() {
    this.isResLoaded = true;
    this.userService.getUserTasks().subscribe(
      (tasks) => {
        this.listaTareasRta = tasks;
        // this.listaTareasRta[0].categoria_nombre =
        this.listaTareas = this.listaTareasRta;
      }
    );
  }

  getFiltredTasks(id: string) {
    this.isResLoaded = true;
    let errorResponse: any;
    this.categoriaService.getTasksByCategory(id).subscribe(
      (tasks) => {
        this.listaTareas = tasks;
        this.isResLoaded = false;
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }

  switchEstadoTarea(tarea: TareaDTO){
    this.isResLoaded = true;
    console.log("id tarea a modif es  " + tarea.id );
    if(tarea.estadoTarea == "completada"){
      tarea.estadoTarea = "pendiente";
    }else{
      tarea.estadoTarea = "completada";
    }
    this.tareaService.updateTask(tarea).subscribe((tarea:any)=>{
      this.isResLoaded = false;
      this.getAllTasks();
    });
  }
  eliminarTarea(id: string) {
    this.isResLoaded = true;
    console.log("borrando id " + id );
    this.tareaService.deleteTask(id).subscribe(()=>{
      this.getAllTasks();
      this.isResLoaded = false;
    })
  }
}
