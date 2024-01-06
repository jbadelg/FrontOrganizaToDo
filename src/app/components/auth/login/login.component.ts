import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TareaServiceService } from 'src/app/services/tarea-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginUser: AuthDTO;
  registroForm: FormGroup;
  userDto: UserDTO;
  email: FormControl;
  password: FormControl;
  isValidForm: boolean | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedService: FeedbackService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private tareaService: TareaServiceService,
    private router: Router
  ) {
      this.loginUser = new AuthDTO();
      this.userDto = new UserDTO('','','','');
      this.isValidForm = null;
      this.email = new FormControl(this.userDto.email, [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]);
      this.password = new FormControl(this.userDto.password, [
        Validators.required,
        Validators.minLength(8),
      ]);
      this.registroForm = this.fb.group({
        email: this.email,
        password: this.password,
      });
  }

  login(): void {
    let responseOK: boolean = false;
    let errorResponse: any;
    this.isValidForm = false;
    console.log(this.registroForm.value);

    if (this.registroForm.invalid) {
      return;
    }
    this.isValidForm = true;
    this.userDto = this.registroForm.value;

    const user: UserDTO = {
      name: '',
      email: this.userDto.email,
      password: this.userDto.password,
      password_confirmation: this.userDto.password
    };

    this.loginUser.user.email = this.userDto.email;
    // this.loginUser.user.password = this.userDto.password;
    // this.tareaService.getAllTasks().subscribe((result:any) => {alert("tarea agregada!");console.log(result);}); //si trae resultados
    this.authService
      .login(user)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            "formFeedback",
            responseOK,
            errorResponse
          );
          if (responseOK) {
            const headerInfo: HeaderMenus = {
              showAuthSection: true,
              showNoAuthSection: false,
            };
            this.headerMenusService.headerManagement.next(headerInfo);
            this.router.navigateByUrl("listarTareas");
          }
        })
      )
      .subscribe(
        (resp: AuthDTO) => {
          responseOK = true;
          // this.loginUser.user_id = resp.user_id;
          // this.loginUser.access_token = resp.access_token;

          this.localStorageService.set("user_id", resp.user.id.toString());
          this.localStorageService.set(
            "access_token",
            resp.token
          );
          this.localStorageService.set("user_name", resp.user.name);
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          errorResponse = error.error;
          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };
          this.headerMenusService.headerManagement.next(headerInfo);

          this.sharedService.errorLog(error.error);
        }
      );


    // .subscribe((result:any) => {
    //   alert("tarea agregada!");
    //   this.userDto.name = '';
    //   this.userDto.email = '';
    //   this.userDto.password = '';
    //   this.userDto.password_confirmation = '';
    //   this.router.navigateByUrl("listarTareas");
    // });

  }
}
