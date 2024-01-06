import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FeedbackService } from './feedback.service';
import { Observable, catchError } from 'rxjs';
import { CategoriaDTO } from '../Models/categoria.dto';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService implements OnInit {
  private urlApi: string;
  private token: string|null;
  private headers: HttpHeaders = new HttpHeaders;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sharedService: FeedbackService
  ) {
    this.token = '';
    this.urlApi = "http://127.0.0.1:8000/api/categorias";
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

  getAllCategories(): Observable<CategoriaDTO[]> {
    return this.http
      .get<CategoriaDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  getCategoryById(categoryId: string): Observable<any> {
    this.obtenerCredenciales();
    return this.http
      .get<any>(this.urlApi + "/" + categoryId,{headers: this.headers})
      // .pipe(catchError(this.sharedService.handleError))
      ;
  }

  createCategory(category: CategoriaDTO): Observable<CategoriaDTO> {
    return this.http
      .post<CategoriaDTO>(this.urlApi, category)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateCategory(
    categoryId: string,
    category: CategoriaDTO
  ): Observable<CategoriaDTO> {
    return this.http
      .put<CategoriaDTO>(this.urlApi + "/" + categoryId, category)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http
      .delete<any>(this.urlApi + "/" + categoryId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getTasksByCategory(categoryId: string): Observable<any> {
    return this.http
      .get<any>(this.urlApi + "/tareas/" + categoryId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
