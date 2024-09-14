import Usuario from "../user/usuario";
import { Bids, InteresState } from "./bids/bids";
import Revision from "./review/revision";

export abstract class Articulo {
  private titulo: string;
  private adjunto: string;
  private bids: Array<Bids>;
  private autores: Array<Usuario>;
  private autorNotificado: Usuario;
  private estado: ArticuloState;
  private revision: Array<Revision>;
  private revisores: Array<Usuario>;

  public constructor(
    titulo: string,
    adjunto: string,
    autores: Array<Usuario>,
    autorNotificado: Usuario
  ) {
    this.titulo = titulo;
    this.adjunto = adjunto;
    this.autores = autores;
    this.autorNotificado = autorNotificado;
    this.estado = ArticuloState.RECIBIDO;
    this.bids = [];
    this.revision = [];
    this.revisores = [];
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public makeBid(user: Usuario, interes: InteresState) {
    const newBid = new Bids(user, interes);
    this.bids.push(newBid);
  }

  public modifyBid(user: Usuario, interes: InteresState) {
    var foundBid = this.bids.find((bid) => {
      user == bid.getRevisor();
    });
    if (foundBid == undefined) {
      throw new Error("The bid was not found");
    }
    const tempBidArray = this.bids.filter((bid) => {
      bid !== foundBid;
    });
    foundBid.setInteres(interes);
    tempBidArray.push(foundBid);
    this.bids = tempBidArray;
  }

  public makeReview(user: Usuario, puntuacion: number, descripcion: string) {
    if (!(puntuacion >= -3 && puntuacion <= 3)) {
      throw new Error("Puntuacion no valida");
    }

    if (this.revision.length == 3) {
      throw new Error("No se aceptan mas revisiones");
    }

    const revisionNueva = new Revision(user, puntuacion, descripcion);
    this.revision.push(revisionNueva);
  }

  public getPuntaje() {
    var puntaje = 0;
    this.revision.forEach((element) => {
      puntaje = puntaje + element.getCalificacion();
    });
    return puntaje;
  }

  public getReviews() {
    return this.revision;
  }

  public getAuthors(): Array<Usuario> {
    return this.autores;
  }

  public getBids() {
    return this.bids;
  }

  public getRevisoresLength() {
    return this.revisores.length;
  }

  public setRevisores(users: Usuario[]) {
    this.revisores = users;
  }

  public setEstado(estado: ArticuloState): void {
    this.estado = estado;
  }

  public getEstado(){
    return this.estado;
  }
}

export enum ArticuloState {
  RECIBIDO = "Recibido",
  RECHAZADO = "Rechazado",
  BIDDING = "Bidding",
  REVISION = "Revision",
  ACEPTADO = "Aceptado",
}
