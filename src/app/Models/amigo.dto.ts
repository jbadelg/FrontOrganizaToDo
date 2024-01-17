export class AmigoDTO {
  id!: string;
  nombre: string;
  email: string;
  user_id!: string;

  constructor(nombre: string, email: string) {
    this.nombre = nombre;
    this.email = email;
  }
}
