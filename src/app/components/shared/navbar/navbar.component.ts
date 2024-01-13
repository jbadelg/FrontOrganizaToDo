import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ToggleService } from 'src/app/services/toggle.service';
import { CrearTareaComponent } from '../../tareas/crear-tarea/crear-tarea.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  @Output() toggleSidenav = new EventEmitter<void>();
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    public toggleService: ToggleService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
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
  }
  logout(): void {
    this.localStorageService.remove('user_id');
    this.localStorageService.remove('access_token');
    this.localStorageService.remove('user_name');

    const headerInfo: HeaderMenus = {
      showAuthSection: false,
      showNoAuthSection: true,
    };
    this.headerMenusService.headerManagement.next(headerInfo);
    this.router.navigateByUrl('');
  }

  toggleDrawer(){
    this.toggleService.toggleDrawer();
  }

  agregarTarea(){
    // const componenteActual = this.getComponenteActual();
    const dialogRef = this.dialog.open(CrearTareaComponent, {
      width: '40%', // Ajusta el ancho según tus necesidades
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getAllTasks();
      // this.router.navigate(componenteActual);
      this.router.navigateByUrl("/listarTareas");
    });
  }

  getComponenteActual() :any {
    console.log("activatedRoute.........", this.activatedRoute);
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    console.log("ruta a navegar .....", route);
    return route.component;
  }
}
