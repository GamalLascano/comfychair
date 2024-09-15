import { Articulo, ArticuloState } from "../articles/articulo";
import { ArticuloRegular } from "../articles/articuloRegular";
import { InteresState } from "../articles/bids/bids";
import Usuario from "../user/usuario";
import { ProjectUtils } from "../utils/projectUtils";
import { Strategy } from "./strategy/strategy";

class Track {
  private nombre: string;
  private articulos: Array<Articulo>;
  private deadline: Date;
  private estado: TrackState;
  private maxArticulos: number;
  private revisores: Array<Usuario>;
  private formaSeleccion: Strategy;

  public constructor(
    nombre: string,
    deadline: Date,
    maxArticulos: number,
    formaSeleccion: Strategy,
    revisores: Usuario[]
  ) {
    this.nombre = nombre;
    this.deadline = deadline;
    this.maxArticulos = maxArticulos;
    this.formaSeleccion = formaSeleccion;
    this.estado = TrackState.RECEPCION;
    this.articulos = [];
    this.revisores = revisores;
  }

  public avanzarEstado(): void {
    switch (this.estado) {
      case TrackState.RECEPCION:
        this.estado = TrackState.BIDDING;
        this.ordenarArticulos();
        break;
      case TrackState.BIDDING:
        this.estado = TrackState.ASIGNACION_REVISION;
        this.divideArticles();
        break;
      case TrackState.ASIGNACION_REVISION:
        this.estado = TrackState.SELECCION;
        break;
      case TrackState.SELECCION:
        console.log("Ya se llego al ultimo estado");
        break;
    }
  }

  private divideArticles() {
    const numArticlesPerReviewer = this.calculateArticlesPerReviewer();
    const surplus = this.calculateSurplus();
    for (let i = 0; i < this.articulos.length; i++) {
      var revisoresFinal: Array<Usuario> = [];
      this.articulos[i].getBids().forEach((bid) => {
        if (
          bid.getInteres() == InteresState.INTERESADO &&
          revisoresFinal.length < this.maxArticulos
        ) {
          const potRevIndex = this.revisores.findIndex(
            (usr) => usr.getEmail() == bid.getRevisor().getEmail()
          );
          if (potRevIndex == -1) {
            throw Error("User mismatch");
          }
          var potRev = this.revisores[potRevIndex];
          const variance = this.sizeChecker(numArticlesPerReviewer, surplus);
          const numArticles = variance
            ? numArticlesPerReviewer + 1
            : numArticlesPerReviewer;
          if (potRev.getReviewLength() < numArticles) {
            potRev.addReview(this.articulos[i].getTitulo());
            revisoresFinal.push(potRev);
          }
        }
      });
      if (revisoresFinal.length < this.maxArticulos) {
        this.articulos[i].getBids().forEach((bid) => {
          if (
            bid.getInteres() == InteresState.QUIZAS &&
            revisoresFinal.length < this.maxArticulos
          ) {
            const potRevIndex = this.revisores.findIndex(
              (usr) => usr.getEmail() == bid.getRevisor().getEmail()
            );
            if (potRevIndex == -1) {
              throw Error("User mismatch");
            }
            var potRev = this.revisores[potRevIndex];
            const variance = this.sizeChecker(numArticlesPerReviewer, surplus);
            const numArticles = variance
              ? numArticlesPerReviewer + 1
              : numArticlesPerReviewer;
            if (potRev.getReviewLength() < numArticles) {
              potRev.addReview(this.articulos[i].getTitulo());
              revisoresFinal.push(potRev);
            }
          }
        });
      }
      if (revisoresFinal.length < this.maxArticulos) {
        const userFilter = this.articulos[i]
          .getBids()
          .map((el) => el.getRevisor().getEmail());
        const filteredUsers = this.revisores.filter(
          (el) => !userFilter.includes(el.getEmail())
        );
        for (let j = 0; j < filteredUsers.length; j++) {
          if (revisoresFinal.length < this.maxArticulos) {
            const variance = this.sizeChecker(numArticlesPerReviewer, surplus);
            const numArticles = variance
              ? numArticlesPerReviewer + 1
              : numArticlesPerReviewer;
            if (filteredUsers[j].getReviewLength() < numArticles) {
              filteredUsers[j].addReview(this.articulos[i].getTitulo());
              revisoresFinal.push(filteredUsers[j]);
            }
          }
        }
      }
      if (revisoresFinal.length < this.maxArticulos) {
        this.articulos[i].getBids().forEach((bid) => {
          if (
            bid.getInteres() == InteresState.NO_INTERESADO &&
            revisoresFinal.length < this.maxArticulos
          ) {
            var potRev = this.revisores.find(
              (usr) => usr.getEmail() == bid.getRevisor().getEmail()
            );
            if (potRev === undefined) {
              throw Error("User mismatch");
            }
            const variance = this.sizeChecker(numArticlesPerReviewer, surplus);
            const numArticles = variance
              ? numArticlesPerReviewer + 1
              : numArticlesPerReviewer;
            if (potRev.getReviewLength() <= numArticles) {
              potRev.addReview(this.articulos[i].getTitulo());
              revisoresFinal.push(potRev);
            }
          }
        });
      }
      this.articulos[i].setRevisores(revisoresFinal);
    }
  }

  private sizeChecker(
    numArticlesPerReviewer: number,
    surplus: number
  ): boolean {
    var checker = 0;
    this.revisores.forEach((el) => {
      if (el.getReviewLength() >= numArticlesPerReviewer + 1) {
        checker++;
      }
    });
    return checker < surplus;
  }
  private calculateArticlesPerReviewer() {
    return Math.floor((3 * this.articulos.length) / this.revisores.length);
  }

  private calculateSurplus() {
    return (3 * this.articulos.length) % this.revisores.length;
  }

  private ordenarArticulos() {
    const articulosOrdenados: Array<Articulo> = [];
    this.articulos.forEach((articulo) => {
      try {
        if (this.filtrarArticulo(articulo)) {
          articulo.setEstado(ArticuloState.BIDDING);
          articulosOrdenados.push(articulo);
        } else {
          articulo.setEstado(ArticuloState.RECHAZADO);
          console.log("El articulo no cumple con los requisitos");
          return;
        }
      } catch (e) {
        console.log(e);
        return;
      }
    });
    this.articulos = articulosOrdenados;
  }

  private seleccionarArticulos(): Articulo[] {
    if (this.estado == TrackState.SELECCION) {
      return this.formaSeleccion.filter(this.articulos);
    } else {
      throw new Error("The track is not in the selection stage");
    }
  }

  private confirmarSeleccionArticulos() {
    this.articulos = this.formaSeleccion.filter(this.articulos);
  }

  public agregarArticulo(articulo: Articulo, day: Date = new Date()) {
    if (day > this.deadline) {
      throw new Error("No more articles are accepted at this stage");
    }
    const foundArticle = this.articulos.find(
      (art) => art.getTitulo() === articulo.getTitulo()
    );
    if (foundArticle) {
      this.articulos = this.articulos.filter((art) => art !== foundArticle);
    }
    if (this.filtrarArticulo(articulo)) {
      articulo.setEstado(ArticuloState.RECIBIDO);
    } else {
      articulo.setEstado(ArticuloState.RECHAZADO);
    }
    this.articulos.push(articulo);
  }

  public editarArticulo(articulo: Articulo, day: Date = new Date()) {
    if (day > this.deadline) {
      throw new Error("You cannot edit this article anymore");
    }
    const foundArticle = this.articulos.find(
      (art) => art.getTitulo() === articulo.getTitulo()
    );
    if (foundArticle) {
      this.articulos = this.articulos.filter((art) => art !== foundArticle);
      if (this.filtrarArticulo(articulo)) {
        articulo.setEstado(ArticuloState.RECIBIDO);
      } else {
        articulo.setEstado(ArticuloState.RECHAZADO);
      }
      this.articulos.push(articulo);
    } else {
      console.log("El articulo no existe en el track");
    }
  }

  public getArticulos() {
    return this.articulos;
  }

  public makeBid(user: Usuario, articulo: Articulo, interes: InteresState) {
    const index = this.articulos.findIndex((el) => el === articulo);
    this.articulos[index].makeBid(user, interes);
  }

  public modifyBid(user: Usuario, articulo: Articulo, interes: InteresState) {
    const index = this.articulos.findIndex((el) => el === articulo);
    this.articulos[index].modifyBid(user, interes);
  }

  //Agregar cosas de extension
  private filtrarArticulo(articulo: Articulo): boolean {
    var verify = this.verifyGeneric(articulo);
    if (articulo instanceof ArticuloRegular) {
      console.log("Es de tipo Articulo Regular");
      verify = verify && this.verifyRegular(articulo);
    }
    return verify;
  }

  private verifyRegular(regular: ArticuloRegular): boolean {
    return ProjectUtils.getWordCount(regular.getAbstract()) > 300;
  }

  private verifyGeneric(poster: Articulo): boolean {
    return poster.getTitulo() != null && poster.getAuthors().length > 0;
  }

  public getNombre() {
    return this.nombre;
  }

  public getRevisores() {
    return this.revisores;
  }

  public addRevisor(reviewer: Usuario) {
    this.revisores.push(reviewer);
  }
}

enum TrackState {
  RECEPCION = "Recepcion",
  BIDDING = "Bidding",
  ASIGNACION_REVISION = "Asignacion y Revision",
  SELECCION = "Seleccion",
}

export default Track;
