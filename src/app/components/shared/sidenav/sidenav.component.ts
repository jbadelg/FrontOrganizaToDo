import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToggleService } from 'src/app/services/toggle.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit{
  showNoAuthSection: boolean;
  showAuthSection: boolean;
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    public toggleService: ToggleService,
    private localStorageService: LocalStorageService
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
  }
  toggleDrawer(){
    this.drawer.toggle();
  }
}
