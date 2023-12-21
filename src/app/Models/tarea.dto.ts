export class TareaDTO {
  tarea_id!: string;
  tarea_nombre: string;
  tarea_estadoTarea!: string;
  tarea_user_id: string;
  tarea_categoria_id: string;
  tarea_tipoTarea: string;
  tarea_descripcion!: string;
  tarea_fechaInicio!: string;
  tarea_fechaVencimiento!: string;
  tarea_duracion!: string;
  tarea_valor!: string;
  tarea_recurrente!: string;
  tarea_periodicidadRecurrencia!: string;
  tarea_subtarea_id!: string;
  tarea_amigo_id!: string;

  constructor(tarea_nombre: string, tarea_tipoTarea: string, tarea_user_id: string, tarea_categoria_id: string) {
    this.tarea_nombre = tarea_nombre;
    this.tarea_tipoTarea = tarea_tipoTarea;
    this.tarea_user_id = tarea_user_id;
    this.tarea_categoria_id = tarea_categoria_id;
  }
}
