import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TareaDTO } from '../Models/tarea.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaServiceService {
  private urlApi: string;

  constructor(private http: HttpClient,) {
    this.urlApi = "http://127.0.0.1:8000/api/tareas";
  }
  createTask(task: TareaDTO): Observable<TareaDTO> {
    return this.http
      .post<TareaDTO>(this.urlApi, task);
  }
  getAllTasks(): Observable<TareaDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer 9|oNVDuKkMNXQWPDR49kCqePMOXPOE2V6yn3Wn8edJ18753a94`
    });
    return this.http.get<TareaDTO[]>(this.urlApi,{headers});
  }
}
