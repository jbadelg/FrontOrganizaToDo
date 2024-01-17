import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { FeedbackService } from './feedback.service';
import { Observable, catchError } from 'rxjs';
import { AmigoDTO } from '../Models/amigo.dto';

@Injectable({
  providedIn: 'root'
})
export class AmigoServiceService implements OnInit {
  private urlApi: string;
  private token: string|null;
  private headers: HttpHeaders = new HttpHeaders;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sharedService: FeedbackService
  ) {
    this.token = '';
    this.urlApi = "http://127.0.0.1:8000/api/amigos";
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

  getAmigoById(amigoId: string): Observable<any> {
    this.obtenerCredenciales();
    return this.http
      .get<any>(this.urlApi + "/" + amigoId,{headers: this.headers})
      .pipe(catchError(this.sharedService.handleError))
      ;
  }

  createAmigo(amigo: AmigoDTO): Observable<any> {
    this.obtenerCredenciales();
    return this.http
      .post<any>(this.urlApi, amigo, {headers: this.headers})
      .pipe(catchError(this.sharedService.handleError));
  }

  updateAmigo(
    amigoId: string,
    amigo: AmigoDTO
  ): Observable<string> {
    this.obtenerCredenciales();
    return this.http
      .put<string>(this.urlApi + "/" + amigoId, amigo,{headers:this.headers})
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteAmigo(amigoId: string): Observable<any> {
    this.obtenerCredenciales();
    return this.http
      .delete<any>(this.urlApi + "/" + amigoId, {headers:this.headers})
      .pipe(catchError(this.sharedService.handleError));
  }
}
