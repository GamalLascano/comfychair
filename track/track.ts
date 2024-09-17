import { Articulo, ArticuloState } from "../articles/articulo";
import { ArticuloRegular } from "../articles/articuloRegular";
import { InteresState } from "../articles/bids/bids";
import Usuario from "../user/usuario";
import { ProjectUtils } from "../utils/projectUtils";
import { Strategy } from "./strategy/strategy";

class Track {
  private static NUM_ARTICULOS_POR_REVIEWER = 3;
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
        throw Error("Ya se llego al ultimo estado")
    }
  }

  private divideArticles() {
    const numArticlesPerReviewer = this.calculateArticlesPerReviewer();
    const surplus = this.calculateSurplus();
    for (let i = 0; i < this.articulos.length; i++) {
      var revisoresFinal: Array<Usuario> = [];
      this.findCandidates(revisoresFinal, i, numArticlesPerReviewer, surplus, InteresState.INTERESADO);
      if (revisoresFinal.length < Track.NUM_ARTICULOS_POR_REVIEWER) {
        this.findCandidates(revisoresFinal, i, numArticlesPerReviewer, surplus, InteresState.QUIZAS);
      }
      if (revisoresFinal.length < Track.NUM_ARTICULOS_POR_REVIEWER) {
        const userFilter = this.articulos[i]
          .getBids()
          .map((el) => el.getRevisor().getEmail());
        const filteredUsers = this.revisores.filter(
          (el) => !userFilter.includes(el.getEmail())
        );
        for (let j = 0; j < filteredUsers.length; j++) {
          if (revisoresFinal.length < Track.NUM_ARTICULOS_POR_REVIEWER) {
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
      if (revisoresFinal.length < Track.NUM_ARTICULOS_POR_REVIEWER) {
        this.findCandidates(revisoresFinal, i, numArticlesPerReviewer, surplus, InteresState.NO_INTERESADO);
      }
      this.articulos[i].setRevisores(revisoresFinal);
    }
  }

  private findCandidates(revisoresFinal: Array<Usuario>, i: number, numArticlesPerReviewer: number, surplus: number, interes: InteresState){
    this.articulos[i].getBids().forEach((bid) => {
      if (
        bid.getInteres() == interes &&
        revisoresFinal.length < Track.NUM_ARTICULOS_POR_REVIEWER
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

  public seleccionarArticulos(): Articulo[] {
    if (this.estado == TrackState.SELECCION) {
      return this.formaSeleccion.filter(this.articulos);
    } else {
      throw new Error("The track is not in the selection stage");
    }
  }

  public confirmarSeleccionArticulos() {
    const finalResult = this.formaSeleccion.filter(this.articulos);
    if (finalResult.length > this.maxArticulos){
      throw new Error("The final result of the selection is higher than the maximum articles, try again");
    }
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

  public setFormaSeleccion(forma: Strategy) {
    this.formaSeleccion = forma
  }

  public setMaxArticles(max: number){
    this.maxArticulos = max
  }
}

enum TrackState {
  RECEPCION = "Recepcion",
  BIDDING = "Bidding",
  ASIGNACION_REVISION = "Asignacion y Revision",
  SELECCION = "Seleccion",
}

export default Track;
