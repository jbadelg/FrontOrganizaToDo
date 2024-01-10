export class TareaDTO {
  id!: string;
  nombre: string;
  estadoTarea!: string;
  user_id: string;
  categoria_id: string;
  categoria_nombre!: string;
  categoria_color!: string;
  tipoTarea: string;
  descripcion!: string;
  fechaInicio!: string;
  fechaVencimiento!: string;
  duracion!: string;
  valor!: string;
  recurrente!: boolean;
  periodicidadRecurrencia!: string;
  subtarea_id!: string;
  amigo_id!: string;

  constructor(nombre: string, tipoTarea: string, user_id: string, categoria_id: string) {
    this.nombre = nombre;
    this.tipoTarea = tipoTarea;
    this.user_id = user_id;
    this.categoria_id = categoria_id;
  }
}
