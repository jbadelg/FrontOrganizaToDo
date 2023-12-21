export class CategoriaDTO {
  categoria_id!: string;
  categoria_nombre: string;
  categoria_color: string;
  categoria_userId!: string;

  constructor(categoria_nombre: string, categoria_color: string) {
    this.categoria_nombre = categoria_nombre;
    this.categoria_color = categoria_color;
  }
}
