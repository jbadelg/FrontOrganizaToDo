import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { TareaServiceService } from 'src/app/services/tarea-service.service';
import {MatListModule} from '@angular/material/list';
import { TareaDTO } from 'src/app/Models/tarea.dto';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-listar-tareas',
  templateUrl: './listar-tareas.component.html',
  styleUrls: ['./listar-tareas.component.scss']
})
export class ListarTareasComponent implements OnInit {
  listaTareas: TareaDTO[] = [];
  isResLoaded = false;
  categoryId: string | null;
  selectedOptions: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tareaService: TareaServiceService,
    private userService: UserServiceService,
    private sharedService: FeedbackService,
    private categoriaService: CategoriaServiceService
  ) {
      this.categoryId = null;
      this.selectedOptions = '';
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((parms: ParamMap) => {
      this.categoryId = parms.get("id");
      if (this.categoryId) {
        this.getFiltredTasks(this.categoryId);
      } else {
        this.getAllTasks();
      }
    });

  }

  getAllTasks() {
    this.isResLoaded = true;
    // this.tareaService.getAllTasks().subscribe((tasks) => {
    this.userService.getUserTasks().subscribe((tasks) => {
      this.listaTareas = tasks;
      this.isResLoaded = false;
    });
  }

  getFiltredTasks(id: string) {
    this.isResLoaded = true;
    let errorResponse: any;
    this.categoriaService.getTasksByCategory(id).subscribe(
      (tasks) => {
        this.listaTareas = tasks;
        this.isResLoaded = false;
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }
}
