import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UserDTO } from '../Models/user.dto';
import { Observable, catchError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { FeedbackService } from './feedback.service';
import { HeaderMenusService } from './header-menus.service';
import { HeaderMenus } from '../Models/header-menus.dto';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  private urlApi: string;
  private controller: string;
  private headers: HttpHeaders;
  private httpOptions: any;
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private headerMenusService: HeaderMenusService,
    private sharedService: FeedbackService
  ) {
    this.controller = "";
    this.urlApi = "http://localhost:8000/api/";
    this.headers = new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'});
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json'}),
      withCredentials: true,
      withXSRFToken: true
    };
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );
  }

  register(user: UserDTO): Observable<any> {
    this.controller = "register";
    this.getToken().subscribe(()=>{
      this.headers.keys().forEach(nombHead => {
        console.log("Header: ", nombHead, "Value: ",this.headers.get(nombHead));
      });
    });

    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json', 'Accept':'application/json', 'X-XSRF-TOKEN': this.getCookie('XSRF-TOKEN')}),
      withCredentials: true,
      withXSRFToken: true
    };

    return this.http
      .post<UserDTO>(this.urlApi + this.controller, user, this.httpOptions)
      .pipe(catchError(this.sharedService.handleError));
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

  isLoggedIn(): boolean {
    return this.localStorageService.get("access_token") != null;
  }
}
