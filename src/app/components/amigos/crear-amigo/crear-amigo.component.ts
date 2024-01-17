import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AmigoDTO } from 'src/app/Models/amigo.dto';
import { AmigoServiceService } from 'src/app/services/amigo-service.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-crear-amigo',
  templateUrl: './crear-amigo.component.html',
  styleUrls: ['./crear-amigo.component.scss']
})
export class CrearAmigoComponent implements OnInit{

  amigo: AmigoDTO;
  nombre: FormControl;
  email: FormControl;
  amigoForm: FormGroup;
  titulo: string = "Agregar";

  constructor(
    @Optional() public dialogRef: MatDialogRef<CrearAmigoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private amigoService: AmigoServiceService,
    private sharedService: FeedbackService,
    private localStorageService: LocalStorageService,
  ){
    this.amigo = new AmigoDTO("","");
    this.nombre = new FormControl(this.amigo.nombre, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.email = new FormControl(this.amigo.email, [
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);
    this.amigoForm = this.formBuilder.group({
      nombre: this.nombre,
      email: this.email
    });

  }

  ngOnInit(): void {
    if (this.data !=null && this.data.amigoId) {
      this.titulo = "Modificar"
      this.amigoService.getAmigoById(this.data.amigoId).subscribe((amigo)=>{
        this.amigo.id = amigo.id;
        this.amigo.nombre = amigo.nombre;
        this.amigo.email = amigo.email;
        this.nombre.setValue(this.amigo.nombre);
        this.email.setValue(this.amigo.email);
        this.amigo.user_id = amigo.user_id;
        this.amigoForm = this.formBuilder.group({
          nombre: this.nombre,
          email: this.email
        });
      });

    }
  }

  public cerrar(){
    console.log("cerrar");
    this.dialogRef.close();
  }

  public guardarAmigo(){
    if (this.amigoForm.invalid) {
      return;
    }
    this.amigo.nombre = this.amigoForm.controls["nombre"].value;
    this.amigo.email = this.amigoForm.controls["email"].value;
    this.amigo.user_id = this.localStorageService.get("user_id")!;

    let responseOK: boolean = false;
    let errorResponse: any;
    if (this.data !=null && this.data.amigoId){
      this.amigoService.updateAmigo(this.data.amigoId, this.amigo)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            "formFeedback",
            responseOK,
            "Amigo actualizado exitosamente!",
            errorResponse
            );
            if(responseOK){
              this.amigoForm.reset();
            }
          })
      )
      .subscribe(()=>{
        responseOK = true;
      },
      (error: HttpErrorResponse) =>{
        responseOK = false;
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      });
    }else{
      this.amigoService.createAmigo(this.amigo)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            "formFeedback",
            responseOK,
            "Amigo creado exitosamente!",
            errorResponse
            );
            if(responseOK){
              this.amigoForm.reset();
            }
          })
        )
        .subscribe(()=>{
          responseOK = true;
        },
        (error: HttpErrorResponse) =>{
          responseOK = false;
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        });
      }
    this.dialogRef.close(this.amigo);
  }

}
