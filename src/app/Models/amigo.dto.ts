export class AmigoDTO {
  id!: string;
  nombre: string;
  email: string;
  userId!: string;

  constructor(nombre: string, email: string) {
    this.nombre = nombre;
    this.email = email;
  }
}
