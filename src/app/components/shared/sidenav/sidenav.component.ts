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
      })
    )
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
  }

  public eliminarCategoria(catId: string) {
    this.categoriaService.deleteCategory(catId).subscribe(()=>{
      this.traerCategorias().subscribe();
    });
    console.log("eliminar ", catId );
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
  }

  public eliminarAmigo(amigoId: string){
    console.log("eliminar amigo" + amigoId);
  }

  public agregarAmigo() {
    console.log("agregar amigo " );
  }
  public filtroRecordatorio() {
    this.setPanel(-1);
    console.log("filtrar por recordatorio" );
  }
}
