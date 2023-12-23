import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserDTO } from '../Models/user.dto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private urlApi: string;
  private controller: string;
  private headers: HttpHeaders;
  private httpOptions: any;

  constructor(private http: HttpClient) {
    this.controller = "";
    this.urlApi = "http://localhost:8000/api/";
    this.headers = new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'});
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'}),
      withCredentials: true,
      withXSRFToken: true
    };
  }

  register(user: UserDTO): Observable<any> {
    this.controller = "register";
    this.getToken().subscribe(()=>{
      this.headers.keys().forEach(nombHead => {
        console.log("Header: ", nombHead, "Value: ",this.headers.get(nombHead));
      });
      // console.log("heads" + this.headers.keys());

    });

    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json', 'X-XSRF-TOKEN': this.getCookie('XSRF-TOKEN')}),
      // headers: new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'}),
      withCredentials: true,
      withXSRFToken: true
    };
    return this.http.post<UserDTO>(this.urlApi + this.controller, user, this.httpOptions);
  }

  login(user: UserDTO): Observable<any>{
    this.getToken();
    this.controller = "login";
    return this.http
      .post<UserDTO>(this.urlApi + this.controller, user, this.httpOptions);
  }

  getToken(): Observable<any> {
    let url = "http://127.0.0.1:8000/sanctum/csrf-cookie";
    return this.http.get(url, this.httpOptions);
    // return this.http.get(url);
  }

  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log("parts::: " , parts);
    if (parts.length === 2) return parts.pop()!.split(';').shift()!;
    return '';
  }
}
