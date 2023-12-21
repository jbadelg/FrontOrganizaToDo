import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserDTO } from '../Models/user.dto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = "";
    this.urlApi = "http://localhost:8000/api/";
  }

  register(user: UserDTO): Observable<UserDTO> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Accept','application/json');
    this.getToken();
    console.log(headers);
    this.controller = "register";
    return this.http
      .post<UserDTO>(this.urlApi + this.controller, user, { headers });
  }

  login(user: UserDTO): Observable<UserDTO>{
    this.controller = "login";
    return this.http
      .post<UserDTO>(this.urlApi + this.controller, user);
  }

  getToken(): Observable<any> {
    let url = "http://127.0.0.1:8000/sanctum/csrf-cookie";
    // return this.http
    //   .get<any>(url);
    return this.http.get(url).pipe(
      tap({
        next: response => {
          console.log('CSRF token response:', response);
        },error: error => {console.error('Error fetching CSRF token:', error);}
      }

      )
    );
  }
}
