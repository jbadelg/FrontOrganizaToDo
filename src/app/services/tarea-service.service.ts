import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { TareaDTO } from '../Models/tarea.dto';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TareaServiceService implements OnInit {
  private urlApi: string;
  private token: string|null;
  private headers: HttpHeaders = new HttpHeaders;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    ) {
      this.token = '';
    this.urlApi = "https://arcane-lowlands-69580-7020d2b6f174.herokuapp.com/api/tareas";
    // this.urlApi = "http://127.0.0.1:8000/api/tareas";
  }
  ngOnInit(): void {
    this.obtenerCredenciales();
  }

  private obtenerCredenciales() {
    this.token = this.localStorageService.get("access_token");
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }

  createTask(task: TareaDTO): Observable<TareaDTO> {
    this.obtenerCredenciales();
    return this.http
      .post<TareaDTO>(this.urlApi, task, {headers: this.headers});
  }
  getAllTasks(): Observable<TareaDTO[]> {
    // const token = this.localStorageService.get("access_token");
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.get<TareaDTO[]>(this.urlApi,{headers: this.headers});
  }
  updateTask(task: TareaDTO): Observable<string> {
    this.obtenerCredenciales();
    return this.http
      .put<string>(this.urlApi + "/" + task.id, task,{headers: this.headers});
  }

  deleteTask(id: string): Observable<string> {
    this.obtenerCredenciales();
    return this.http
      .delete<string>(this.urlApi + "/" + id,{headers: this.headers});
  }
}
