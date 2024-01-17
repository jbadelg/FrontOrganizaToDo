import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AmigoDTO } from 'src/app/Models/amigo.dto';
import { CategoriaDTO } from 'src/app/Models/categoria.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToggleService } from 'src/app/services/toggle.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { CrearCategoriaComponent } from '../../categorias/crear-categoria/crear-categoria.component';
import { FeedbackService } from 'src/app/services/feedback.service';
import { CrearAmigoComponent } from '../../amigos/crear-amigo/crear-amigo.component';
import { AmigoServiceService } from 'src/app/services/amigo-service.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit{
  showNoAuthSection: boolean;
  panel = -1;
  showAuthSection: boolean;
  @ViewChild('drawer') drawer!: MatDrawer;
  listaCategorias: CategoriaDTO[] = [];
  listaAmigos: AmigoDTO[] = [];

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    public toggleService: ToggleService,
    private categoriaService: CategoriaServiceService,
    private amigoService: AmigoServiceService,
    private sharedService: FeedbackService,
    private localStorageService: LocalStorageService,
    private userService: UserServiceService,
    public dialog: MatDialog
  ){
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );
    this.toggleService.$toogle.subscribe(()=>{
      this.toggleDrawer();
    });
    this.traerCategorias().subscribe();
    this.traerAmigos();
  }
  public home(){
    this.setPanel(-1);
    this.router.navigate(['/listarTareas']);
  }
  setPanel(activePanel: number){
    this.panel = activePanel;
  }
  toggleDrawer(){
    this.drawer.toggle();
  }
  private traerCategorias() {
    console.log("trayendo categorías");
    return this.userService.getUserCategorias().pipe(
      map(cats => {
        this.listaCategorias = cats.data.map((item:any) => new CategoriaDTO(item));
        this.listaCategorias.map(cat=>{
          cat.categoria_color_texto = this.colorTexto(cat.categoria_color);
        });
      })
    )
  }
  public colorTexto(color: string): string {
    const isColorOscuro = this.esColorOscuro(color);
    return isColorOscuro ? 'white' : 'black';
  }
  public esColorOscuro(color: string): boolean{
    const hex = color.substring(1); // Elimina el caracter '#'
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminosidad < 0.5; // Devuelve verdadero si es oscuro
  }
  private traerAmigos() {
    this.userService.getUserAmigos().subscribe((amigos) => {
      if (amigos.message !== "El usuario no tiene amigos registrados") {
        this.listaAmigos = amigos;
      }
    });
  }

  public filtroFecha(fecha:string ){
    switch (fecha) {
      case 'hoy':
        console.log(" 1 filtro fecha "  + fecha);
        break;
      case 'semana':
        console.log(" 2 filtro fecha "  + fecha);
        break;
      case 'due':
        console.log(" 3 filtro fecha "  + fecha);
        break;

      default:
        break;
    }
  }
  public filtroCategoria(catId: string) {
    console.log("filtrar ", catId );
  }
  public editarCategoria(catId: string) {
    console.log("editar ", catId );
    const dialogRef = this.dialog.open(CrearCategoriaComponent, {
      width: '25%',
      data: {catId: catId}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.traerCategorias().subscribe();
    });
  }

  public eliminarCategoria(catId: string) {
    this.categoriaService.deleteCategory(catId).subscribe(()=>{
      this.traerCategorias().subscribe();
    });
  }

  public agregarCategoria() {
    console.log("agregar " );
    const dialogRef = this.dialog.open(CrearCategoriaComponent, {
      width: '25%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.traerCategorias().subscribe();
    });
  }

  public filtrarAmigo(amigoId: string){
    console.log("filtrar amigo" + amigoId);
  }

  public editarAmigo(amigoId: string){
    console.log("editar amigo" + amigoId);
    const dialogRef = this.dialog.open(CrearAmigoComponent, {
      width: '25%',
      data: {amigoId: amigoId}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.traerAmigos();
    });
  }

  public eliminarAmigo(amigoId: string){
    console.log("eliminar amigo" + amigoId);
    this.amigoService.deleteAmigo(amigoId).subscribe(()=>{
      this.traerAmigos();
    });
  }

  public agregarAmigo() {
    console.log("agregar amigo " );
    const dialogRef = this.dialog.open(CrearAmigoComponent, {
      width: '25%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.traerAmigos();
    });
  }
  public filtroRecordatorio() {
    this.setPanel(-1);
    console.log("filtrar por recordatorio" );
  }


}

