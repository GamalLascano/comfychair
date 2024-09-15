import Track from "../track/track";
import Usuario from "../user/usuario";

class Conferencia {
  private chairs: Array<Usuario>;
  private revisores: Array<Usuario>;
  private autores: Array<Usuario>;
  private sesiones: Array<Track>;

  public constructor(
    chairs: Array<Usuario>,
    revisores: Array<Usuario>,
    autores: Array<Usuario>
  ) {
    this.chairs = chairs;
    this.revisores = revisores;
    this.autores = autores;
    this.sesiones = [];
  }

  public addSession(session: Track): void {
    this.sesiones.push(session);
  }

  public getSessions() {
    return this.sesiones;
  }

  public getChairs(): Array<Usuario> {
    return this.chairs;
  }

  public getRevisores(): Array<Usuario> {
    return this.revisores;
  }

  public getAutores(): Array<Usuario> {
    return this.autores;
  }

  public addReviewer(reviewer: Usuario) {
    this.sesiones.forEach((session) => {
      session.addRevisor(reviewer);
    });
  }
}

export default Conferencia;
