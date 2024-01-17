import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
 } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { CategoriaDTO } from 'src/app/Models/categoria.dto';
import { CategoriaOutDTO } from 'src/app/Models/categoriaOut.dto';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.scss']
})
export class CrearCategoriaComponent implements OnInit{
  categoria: CategoriaOutDTO;
  nombre: FormControl;
  colorCat: FormControl;
  categoriaForm: FormGroup;
  colorPalette: ThemePalette;
  isResLoaded: boolean = false;
  colorDin: string = "#ffffff";
  titulo: string = "Agregar";

  constructor(
    @Optional() public dialogRef: MatDialogRef<CrearCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaServiceService,
    private sharedService: FeedbackService,
    private localStorageService: LocalStorageService,
  ){
    this.categoria = new CategoriaOutDTO("","#ffffff",this.localStorageService.get("user_id"));
    this.nombre = new FormControl(this.categoria.nombre, [
      Validators.required,
      Validators.maxLength(25),
    ]);
    this.colorCat = new FormControl(this.categoria.color, [
      Validators.pattern(/^#[0-9A-Fa-f]{6}$/)
    ]);
    this.categoriaForm = this.formBuilder.group({
      nombre: this.nombre,
      color: this.colorCat
    });

  }
  ngOnInit(): void {
    if (this.data !=null && this.data.catId) {
      this.titulo = "Modificar"
      this.categoriaService.getCategoryById(this.data.catId).subscribe((cat)=>{
        this.categoria.id = cat.data.categoria_id;
        this.categoria.nombre = cat.data.categoria_nombre;
        this.nombre.setValue(this.categoria.nombre);
        this.categoria.color = cat.data.categoria_color;
        this.colorCat.setValue(this.categoria.color);
        this.colorDin = this.categoria.color;
        this.categoria.user_id = cat.data.categoria_user_id;
        this.categoriaForm = this.formBuilder.group({
          nombre: this.nombre,
          color: this.colorCat
        });
      });

    }
  }

  public cerrar(){
    this.dialogRef.close();
  }

  public guardarCategoria(){
    if (this.categoriaForm.invalid) {
      return;
    }
    this.categoria.nombre = this.categoriaForm.controls["nombre"].value;
    this.categoria.color = "#" + this.categoriaForm.controls["color"].value.hex;

    let responseOK: boolean = false;
    let errorResponse: any;
    if (this.data !=null && this.data.catId){
      this.categoriaService.updateCategory(this.data.catId, this.categoria)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            "formFeedback",
            responseOK,
            "Categoría actualizada exitosamente!",
            errorResponse
            );
            if(responseOK){
              this.categoriaForm.reset();
            }
          })
      )
      .subscribe(()=>{
        responseOK = true;
        this.isResLoaded = false;
      },
      (error: HttpErrorResponse) =>{
        responseOK = false;
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      });
    }else{
      this.categoriaService.createCategory(this.categoria)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            "formFeedback",
            responseOK,
            "Categoría agregada exitosamente!",
            errorResponse
            );
            if(responseOK){
              this.categoriaForm.reset();
            }
          })
        )
        .subscribe(()=>{
          responseOK = true;
          this.isResLoaded = false;
        },
        (error: HttpErrorResponse) =>{
          responseOK = false;
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        });
      }
    this.dialogRef.close(this.categoria);
  }
  public colorDinam(){
    console.log("color  ", this.colorDin);
    this.colorDin = "#" + this.categoriaForm.controls["color"].value.hex;
  }
}
