import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedbackService } from './feedback.service';
import { Observable, catchError } from 'rxjs';
import { CategoriaDTO } from '../Models/categoria.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
  private urlApi: string;

  constructor(
    private http: HttpClient,
    private sharedService: FeedbackService
  ) {
    this.urlApi = "http://127.0.0.1:8000/api/categorias";
  }

  getAllCategories(): Observable<CategoriaDTO[]> {
    return this.http
      .get<CategoriaDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  getCategoryById(categoryId: string): Observable<CategoriaDTO> {
    return this.http
      .get<CategoriaDTO>(this.urlApi + "/" + categoryId)
      .pipe(catchError(this.sharedService.handleError));
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
