import Usuario from "../../user/usuario";

class Revision {
  private revisor: Usuario;
  private calificacion: number;
  private descripcion: string;

  public constructor(
    revisor: Usuario,
    calificacion: number,
    descripcion: string
  ) {
    this.revisor = revisor;
    this.calificacion = calificacion;
    this.descripcion = descripcion;
  }

  public getRevisor(): Usuario {
    return this.revisor;
  }

  public getCalificacion(): number {
    return this.calificacion;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }
}
export default Revision;
