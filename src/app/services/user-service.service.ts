import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserDTO } from '../Models/user.dto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';
import { LocalStorageService } from './local-storage.service';
import { TareaDTO } from '../Models/tarea.dto';
import { CategoriaDTO } from '../Models/categoria.dto';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private urlApi: string;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {
    this.urlApi = "http://localhost:8000/api/users";
  }

  getUserTasks(): Observable<TareaDTO[]> {
    const token = this.localStorageService.get("access_token");
    const user_id = this.localStorageService.get("user_id");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<TareaDTO[]>(this.urlApi + `/tareas/${user_id}`,{headers});
  }

  getUserCategorias(): Observable<any> {
    const token = this.localStorageService.get("access_token");
    const user_id = this.localStorageService.get("user_id");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.urlApi + `/categorias/${user_id}`,{headers});
  }

  getUserAmigos(): Observable<any> {
    const token = this.localStorageService.get("access_token");
    const user_id = this.localStorageService.get("user_id");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.urlApi + `/amigos/${user_id}`,{headers});
  }
}
