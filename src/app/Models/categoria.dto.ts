export class CategoriaDTO {
  categoria_id!: string;
  categoria_nombre: string;
  categoria_color: string;
  categoria_user_id!: string;

  constructor(data:any) {
    this.categoria_id = data && data.categoria_id ? data.categoria_id:'';
    this.categoria_nombre = data && data.categoria_nombre ? data.categoria_nombre:'';
    this.categoria_color = data && data.categoria_color ? data.categoria_color:'';
    this.categoria_user_id = data && data.categoria_user_id ? data.categoria_user_id:'';
  }
}
