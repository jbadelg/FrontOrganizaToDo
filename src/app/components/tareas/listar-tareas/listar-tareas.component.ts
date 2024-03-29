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
import { mergeMap, catchError, map } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CrearTareaComponent } from '../crear-tarea/crear-tarea.component';
import { CategoriaDTO } from 'src/app/Models/categoria.dto';
import { AmigoDTO } from 'src/app/Models/amigo.dto';

@Component({
  selector: 'app-listar-tareas',
  templateUrl: './listar-tareas.component.html',
  styleUrls: ['./listar-tareas.component.scss']
})
export class ListarTareasComponent implements OnInit {
  listaTareas: any[] = [];
  listaTareasRta: TareaDTO[] = [];
  listaCategorias: CategoriaDTO[] = [];
  listaAmigos: AmigoDTO[] = [];
  isResLoaded = false;
  categoryId: string | null;
  amigoId: string | null;
  selectedOptions: string;
  verFinalizadas: boolean = true;
  titulo: string = "Todas tus tareas"

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tareaService: TareaServiceService,
    private userService: UserServiceService,
    private sharedService: FeedbackService,
    private categoriaService: CategoriaServiceService,
    public dialog: MatDialog
  ) {
    this.categoryId = null;
    this.amigoId = null;
    this.selectedOptions = '';
  }

  ngOnInit(): void {
    this.sharedService.setLoading(true);

    forkJoin([
      this.traerCategorias(),
      this.traerAmigos()
    ]).subscribe(([categorias, amigos])=>{
      // this.activatedRoute.paramMap.subscribe((parms: ParamMap) => {
      //   this.categoryId = parms.get("id");
        this.activatedRoute.params.subscribe(params =>{
        this.categoryId = params["id_cat"];
        this.amigoId = params["amigoId"];
        let record = params["recordatorio"];
        if (this.categoryId) {
          this.getFiltredTasks(this.categoryId);
        } else {
          if(this.amigoId){
            this.getFiltroAmigo(this.categoryId);
            this.titulo = "Amigo: " + this.getAmigoNombre(this.amigoId);
          }else{
            if(record){
              this.titulo = "Recordatorios ";
              this.getFiltroRecordatorio();
            }else{
              this.getAllTasks1();
            }
          }
        }
        this.sharedService.setLoading(false);
      });
    });
  }
  getFiltroRecordatorio() {
    this.userService.getUserTasks().subscribe(
      (tasks) => {
        tasks.forEach((task, index) => {
          const categoriaEncontrada = this.listaCategorias.find(cat => cat.categoria_id === task.categoria_id);
          if (categoriaEncontrada) {
            task.categoria_nombre = categoriaEncontrada.categoria_nombre;
            task.categoria_color = categoriaEncontrada.categoria_color;
          }
        });
        tasks = tasks.filter(tarea => tarea.tipoTarea == "recordatorio");
        this.listaTareasRta = tasks;
        this.listaTareas = this.listaTareasRta;
      }
    );
  }

  getFiltroAmigo(amigoId: string | null) {
    this.userService.getUserTasks().subscribe(
      (tasks) => {
        tasks.forEach((task, index) => {
          const categoriaEncontrada = this.listaCategorias.find(cat => cat.categoria_id === task.categoria_id);
          if (categoriaEncontrada) {
            task.categoria_nombre = categoriaEncontrada.categoria_nombre;
            task.categoria_color = categoriaEncontrada.categoria_color;
          }
        });
        this.listaTareasRta = tasks.filter(tarea => tarea.amigo_id != amigoId);
        this.listaTareas = this.listaTareasRta;
      }
    );
  }

  private traerCategorias() {
    return this.userService.getUserCategorias().pipe(
      map(cats => {
        this.listaCategorias = cats.data.map((item:any) => new CategoriaDTO(item));
      })
    )
  }
  private traerAmigos() {
    return this.userService.getUserAmigos().pipe(
      map(amigos => {
        if (amigos.message !== "El usuario no tiene amigos registrados"){
          this.listaAmigos = amigos;
        }
      })
    );
  }

  public getAmigoNombre(id: string): string | undefined{
    let ami = this.listaAmigos.find(amigo => id == amigo.id);
    return ami ? ami.nombre : undefined ;
  }

  getAllTasks() {
    this.isResLoaded = true;
    this.sharedService.setLoading(true);

    this.userService.getUserTasks().pipe(
      mergeMap(tasks => {
        const observables = tasks.map(task => {
          const categoriaId = task.categoria_id;
          return this.categoriaService.getCategoryById(categoriaId);
        });

        return forkJoin(observables).pipe(
          catchError(error => {
            this.sharedService.setLoading(false);
            console.error('Error al obtener las categorías:', error);
            return of([]); // Devuelve un observable vacío en caso de error
          }),
          // Combina las tareas con las categorías
          mergeMap(categorias => {
            tasks.forEach((task, index) => {
              task.categoria_nombre = categorias[index].data.categoria_nombre;
              task.categoria_color = categorias[index].data.categoria_color;
              // console.log("colores " + task.categoria_color);
            });
            this.listaTareas = tasks;
            this.isResLoaded = false;
            // Emite las tareas actualizadas
            this.sharedService.setLoading(false);
            return of(this.listaTareas);
          })
        );
      })
    ).subscribe(tareas => {},
      error => {
        console.error('Error al obtener las tareas:', error);
        this.sharedService.setLoading(false);
        this.isResLoaded = false;
      }
    );
  }
  getAllTasks1() {
    this.isResLoaded = true;
    this.userService.getUserTasks().subscribe(
      (tasks) => {
        tasks.forEach((task, index) => {
          const categoriaEncontrada = this.listaCategorias.find(cat => cat.categoria_id === task.categoria_id);
          if (categoriaEncontrada) {
            task.categoria_nombre = categoriaEncontrada.categoria_nombre;
            task.categoria_color = categoriaEncontrada.categoria_color;
          }
        });
        this.listaTareasRta = tasks;
        this.listaTareas = this.listaTareasRta;
      }
    );
  }

  getFiltredTasks(id: string) {
    this.isResLoaded = true;
    let errorResponse: any;
    let nombCat = this.listaCategorias.find(cat => cat.categoria_id == id);
    this.titulo = "Categoria: " + nombCat?.categoria_nombre;
    this.categoriaService.getTasksByCategory(id).subscribe(
      (tasks) => {
        tasks.forEach((task, index) => {
          const categoriaEncontrada = this.listaCategorias.find(cat => cat.categoria_id === task.categoria_id);
          if (categoriaEncontrada) {
            task.categoria_nombre = categoriaEncontrada.categoria_nombre;
            task.categoria_color = categoriaEncontrada.categoria_color;
          }
        });
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
    this.sharedService.setLoading(true);
    console.log("id tarea a modif es  " + tarea.id );
    if(tarea.estadoTarea == "completada"){
      tarea.estadoTarea = "pendiente";
    }else{
      tarea.estadoTarea = "completada";
    }
    this.tareaService.updateTask(tarea).subscribe((tarea:any)=>{
      this.getAllTasks1();
      this.isResLoaded = false;
      this.sharedService.setLoading(false);
    });
  }
  eliminarTarea(id: string) {
    this.isResLoaded = true;
    this.sharedService.setLoading(true);
    console.log("borrando id " + id );
    this.tareaService.deleteTask(id).subscribe(()=>{
      this.getAllTasks1();
      this.isResLoaded = false;
      this.sharedService.setLoading(false);
    })
  }

  agregarTarea(){
    const dialogRef = this.dialog.open(CrearTareaComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllTasks1();
      this.router.navigateByUrl("/listarTareas");
      this.sharedService.setLoading(false);
    });
  }
}
