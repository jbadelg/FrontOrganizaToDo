import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  private toggleSorce = new Subject<void>();
  $toogle = this.toggleSorce.asObservable();

  toggleDrawer(){
    this.toggleSorce.next();
  }

  constructor() { }
}
