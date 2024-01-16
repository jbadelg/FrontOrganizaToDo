import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TareaDTO } from 'src/app/Models/tarea.dto';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { TareaServiceService } from 'src/app/services/tarea-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import {MatNativeDateModule} from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
 } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { CategoriaDTO } from 'src/app/Models/categoria.dto';
import { AmigoDTO } from 'src/app/Models/amigo.dto';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.scss'],
})
export class CrearTareaComponent implements OnInit {
  categorias: CategoriaDTO[] = [];
  amigos: AmigoDTO[] = [];
  tiposTareas: string[] = ["Recordatorio", "Obligación", "Tarea"];
  @ViewChild('picker1') picker1!: MatDatepicker<Date>;
  @ViewChild('picker2') picker2!: MatDatepicker<Date>;
  isResLoaded: boolean = false;
  tarea: TareaDTO;
  nombre: FormControl;
  tareaForm: FormGroup;
  descripcion: FormControl;
  fechaInicio: FormControl;
  fechaVencimiento: FormControl;
  categoria_id: FormControl;
  // tipoTarea: FormControl;
  valor: FormControl;
  recurrente: FormControl;
  periodicidadRecurrencia: FormControl;
  amigo_id: FormControl;
  isValidForm: boolean | null;
  esRecordatorio: FormControl;
  // picker1: any;

  constructor(
    @Optional() public dialogRef: MatDialogRef<CrearTareaComponent>,
    private activatedRoute: ActivatedRoute,
    private tareaService: TareaServiceService,
    private userService: UserServiceService,
    private localStorageService: LocalStorageService,
    private sharedService: FeedbackService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaServiceService,
    private router: Router,
  ){
    this.tarea = new TareaDTO('','','','');
    this.isValidForm = null;
    this.nombre = new FormControl(this.tarea.nombre, [
      Validators.required,
      Validators.maxLength(55),
    ]);
    this.descripcion = new FormControl(this.tarea.descripcion, [
      Validators.maxLength(255),
    ]);
    // this.tipoTarea = new FormControl(this.tarea.tipoTarea, []);
    this.categoria_id = new FormControl(this.tarea.categoria_id, [Validators.required,]);
    this.fechaInicio = new FormControl(this.tarea.fechaInicio);
    this.fechaVencimiento = new FormControl(this.tarea.fechaVencimiento);
    this.valor = new FormControl(this.tarea.valor, []);
    this.recurrente = new FormControl(this.tarea.recurrente, []);
    this.esRecordatorio = new FormControl(null, []);
    this.periodicidadRecurrencia = new FormControl({value:this.tarea.periodicidadRecurrencia,disabled:true}, []);
    this.amigo_id = new FormControl(this.tarea.amigo_id, []);
    this.tareaForm = this.formBuilder.group({
      nombre: this.nombre,
      descripcion: this.descripcion,
      // tipoTarea: this.tipoTarea,
      fechaInicio: this.fechaInicio,
      fechaVencimiento: this.fechaVencimiento,
      valor: this.valor,
      esRecordatorio: this.esRecordatorio,
      recurrente: this.recurrente,
      periodicidadRecurrencia: this.periodicidadRecurrencia,
      amigo_id: this.amigo_id,
      categoria_id: this.categoria_id,
    });
    this.tareaForm.get('recurrente')!.valueChanges.subscribe((value) => {
      const frecuenciaControl = this.tareaForm.get('frecuencia');
      if (value) {
        this.periodicidadRecurrencia.enable();
      } else {
        this.periodicidadRecurrencia.disable();
        this.periodicidadRecurrencia.setValue(null);
      }
    });
  }
  ngOnInit(): void {
    this.traerCategorias();
    this.traerAmigos();
  }

  private traerCategorias() {
    this.userService.getUserCategorias().subscribe((cats) => {
      this.categorias = cats.data.map((item:any) => new CategoriaDTO(item));
    });
  }
  private traerAmigos() {
    this.userService.getUserAmigos().subscribe((amigos) => {
      if (amigos.message !== "El usuario no tiene amigos registrados") {
        this.amigos = amigos;
      }
    });
  }

  cerrar(){
    console.log("cerrar");
    this.dialogRef.close();
  }

  addTarea(){
    this.isValidForm = false;

    if (this.tareaForm.invalid) {
      return;
    }
    this.isValidForm = true;
    this.tarea = this.tareaForm.value;
    // console.log("this.tareaForm.value: ", this.tareaForm.value );
    // this.tarea.fechaInicio = this.tareaForm.controls["fechaInicio"].value?.toLocaleDateString('YYYYMMDD', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '');
    if (this.tareaForm.controls["fechaInicio"].value){
      let anno = this.tareaForm.controls["fechaInicio"].value?.getFullYear();
      let mes = (this.tareaForm.controls["fechaInicio"].value?.getMonth() + 1).toString().padStart(2, '0');
      let dia = this.tareaForm.controls["fechaInicio"].value?.getDate().toString().padStart(2, '0');
      this.tarea.fechaInicio = `${anno}${mes}${dia}`;
    }
    if (this.tareaForm.controls["fechaVencimiento"].value) {
      let anno = this.tareaForm.controls["fechaVencimiento"].value?.getFullYear();
      let mes = (this.tareaForm.controls["fechaVencimiento"].value?.getMonth() + 1).toString().padStart(2, '0');
      let dia = this.tareaForm.controls["fechaVencimiento"].value?.getDate().toString().padStart(2, '0');
      this.tarea.fechaVencimiento = `${anno}${mes}${dia}`;
    }
    if (this.tareaForm.controls["valor"].value) {
      this.tarea.valor = this.tareaForm.controls["valor"].value.replace(/[^\d]/g, '');
    }
    if (this.esRecordatorio) {
      this.tarea.tipoTarea = "recordatorio";
    }
    // console.log("tarea: ", this.tarea);
    // this.tarea.recurrente = this.tareaForm.controls["recurrente"].value === "si" ? "true" : "false";
    // this.tarea.recurrente = this.tareaForm.controls["recurrente"].value === "si";


    this.tarea.user_id = this.localStorageService.get("user_id")!;
    this.tarea.estadoTarea = "pendiente";

    let responseOK: boolean = false;
    let errorResponse: any;
    this.tareaService
      .createTask(this.tarea)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            "formFeedback",
            responseOK,
            errorResponse
          );
          if(responseOK){
            this.tareaForm.reset();
          }
        })
      )
      .subscribe(()=>{
        responseOK = true;
        this.isResLoaded = false;
      },
      (error: HttpErrorResponse) => {
        responseOK = false;
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      });
    // this.tareaService.createTask(this.tarea).subscribe(()=>{
    //   this.isResLoaded = false;
    // });
    this.dialogRef.close({ nombreTarea: this.nombre });
  }

  formatoMoneda(event: any): void {
    const input = event.target;
    const valor = input.value.replace(/[^\d]/g, ''); // Eliminar todo excepto los dígitos
    const valorFormateado = this.formatearNumero(Number(valor));
    input.value = `$${valorFormateado}`;
    // this.tareaForm.controls['valor'].setValue((valor)); // Actualizar el valor en el FormGroup

  }

  formatearNumero(numero: number): string {
    return numero.toLocaleString('es-CO'); // Ajusta la localidad según tus necesidades
  }
}
