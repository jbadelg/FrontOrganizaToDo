import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TareaDTO } from '../Models/tarea.dto';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TareaServiceService {
  private urlApi: string;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {
    this.urlApi = "http://127.0.0.1:8000/api/tareas";
  }
  createTask(task: TareaDTO): Observable<TareaDTO> {
    return this.http
      .post<TareaDTO>(this.urlApi, task);
  }
  getAllTasks(): Observable<TareaDTO[]> {
    const token = this.localStorageService.get("access_token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<TareaDTO[]>(this.urlApi,{headers});
  }
}
