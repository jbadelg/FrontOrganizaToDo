export class AmigoDTO {
  amigo_id!: string;
  amigo_nombre: string;
  amigo_email: string;
  amigo_userId!: string;

  constructor(amigo_nombre: string, amigo_email: string) {
    this.amigo_nombre = amigo_nombre;
    this.amigo_email = amigo_email;
  }
}
