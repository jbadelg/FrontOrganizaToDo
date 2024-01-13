import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedbackService } from './services/feedback.service';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';
import { LocalStorageService } from './services/local-storage.service';
import { HeaderMenus } from './Models/header-menus.dto';
import { HeaderMenusService } from './services/header-menus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'FrontOrganizaToDo';
  loading: boolean;

  constructor(
    private localStorageService: LocalStorageService,
    private headerMenusService: HeaderMenusService
  ) {
    this.loading = false;
  }
  ngOnInit(): void {
    const token = this.localStorageService.get("access_token");
    const headerInfo: HeaderMenus = {
      showAuthSection: true,
      showNoAuthSection: false,
    };
    if(token){
      this.headerMenusService.headerManagement.next(headerInfo);
    }
  }

}
