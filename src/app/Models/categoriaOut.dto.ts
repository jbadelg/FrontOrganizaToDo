export class CategoriaOutDTO {
  id!: string;
  nombre: string;
  color: string;
  user_id!: string;

  constructor(nombre:string, color: string, user_id: string|null) {
    this.nombre = nombre;
    this.color = color;
    this.user_id = user_id!;
  }
}
