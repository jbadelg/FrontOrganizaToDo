import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/Models/user.dto';
import { TareaServiceService } from 'src/app/services/tarea-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  registroForm: FormGroup;
  userDto: UserDTO;
  email: FormControl;
  password: FormControl;
  isValidForm: boolean | null;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private tareaService: TareaServiceService,
    private router: Router
  ) {
      this.userDto = new UserDTO('','','');
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
    };
    // this.tareaService.getAllTasks().subscribe((result:any) => {alert("tarea agregada!");console.log(result);}); //si trae resultados
    this.userService.login(user)
    .subscribe((result:any) => {
      alert("tarea agregada!");
      this.userDto.name = '';
      this.userDto.email = '';
      this.userDto.password = '';
      this.router.navigateByUrl("listarTareas");
    });

  }
}
