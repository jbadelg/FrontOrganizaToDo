import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from 'src/app/Models/user.dto';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AuthDTO } from 'src/app/Models/auth.dto';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  userDto: UserDTO;
  name: FormControl;
  email: FormControl;
  password: FormControl;
  isValidForm: boolean | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedService: FeedbackService,
    private localStorageService: LocalStorageService,
    private headerMenusService: HeaderMenusService,
    private router: Router
  ) {
      this.userDto = new UserDTO('','','','');
      this.isValidForm = null;
      this.name = new FormControl(this.userDto.name,[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]);
      this.email = new FormControl(this.userDto.email, [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]);
      this.password = new FormControl(this.userDto.password, [
        Validators.required,
        Validators.minLength(8),
      ]);
      this.registroForm = this.fb.group({
        name: this.name,
        email: this.email,
        password: this.password,
      });
  }

  ngOnInit(): void {};

  registrar(): void {
    this.isValidForm = false;
    let responseOK: boolean = false;
    let errorResponse: any;

    console.log("datos form; ", this.registroForm.value);

    if (this.registroForm.invalid) {
      return;
    }
    this.isValidForm = true;
    this.userDto = this.registroForm.value;

    const user: UserDTO = {
      name: this.userDto.name,
      email: this.userDto.email,
      password: this.userDto.password,
      password_confirmation: this.userDto.password,
    };
    this.authService
      .register(user)
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
            this.registroForm.reset();
            this.headerMenusService.headerManagement.next(headerInfo);
            this.router.navigateByUrl("listarTareas");
          }
        })
      )
      .subscribe(
        (resp: AuthDTO) => {
          responseOK = true;
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
          this.sharedService.errorLog(errorResponse);
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
