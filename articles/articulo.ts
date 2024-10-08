import Usuario from "../user/usuario";
import { Bids, InteresState } from "./bids/bids";
import Revision from "./review/revision";

export abstract class Articulo {
  private titulo: string;
  private adjunto: string;
  private bids: Array<Bids>;
  private autores: Array<Usuario>;
  private autorNotificado: Usuario | null;
  private estado: ArticuloState;
  private revision: Array<Revision>;
  private revisores: Array<Usuario>;

  public constructor(){
    this.estado = ArticuloState.RECIBIDO;
    this.bids = [];
    this.revision = [];
    this.revisores = [];
    this.titulo = "";
    this.adjunto = "";
    this.autores = [];
    this.autorNotificado = null;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public makeBid(user: Usuario, interes: InteresState) {
    const newBid = new Bids(user, interes);
    var foundBid = this.bids.find((bid) => {
      return user.getEmail() === bid.getRevisor().getEmail();
    });
    if (foundBid != undefined) {
      this.bids = this.bids.filter((bid) => {
        return user.getEmail() !== bid.getRevisor().getEmail();
      });
    }
    this.bids.push(newBid);
  }

  public modifyBid(user: Usuario, interes: InteresState) {
    var foundBid = this.bids.find((bid) => {
      return user.getEmail() === bid.getRevisor().getEmail();
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
    const foundReviewer = this.revisores.find((reviewer) => {
      return user.getEmail() === reviewer.getEmail();
    });

    if (foundReviewer == undefined) {
      throw new Error("This user is not allowed to make a review");
    }

    const foundReview = this.revision.find((review) => {
      return user.getEmail() === review.getRevisor().getEmail();
    });
    
    if (foundReview != undefined) {
      throw new Error("This user already made a review");
    }

    if (!(puntuacion >= -3 && puntuacion <= 3)) {
      throw new Error("Puntuacion no valida");
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

  public getRevisores() {
    return this.revisores;
  }

  public setRevisores(users: Usuario[]) {
    this.revisores = users;
  }

  public setEstado(estado: ArticuloState): void {
    this.estado = estado;
  }

  public getEstado() {
    return this.estado;
  }

  public setAutores(autores: Array<Usuario>) {
    this.autores = autores;
  }

  public setAutorNotificado(autor: Usuario) {
    this.autorNotificado = autor;
  }

  public setAdjunto(adjunto: string) {
    this.adjunto = adjunto;
  }

  public setTitulo(titulo: string) {
    this.titulo = titulo;
  }
}

export enum ArticuloState {
  RECIBIDO = "Recibido",
  RECHAZADO = "Rechazado",
  BIDDING = "Bidding",
  REVISION = "Revision",
  ACEPTADO = "Aceptado",
}
