class Track {
  private articulos: Array<Articulo>;
  private deadline: Date;
  private estado: TrackState;
  private maxArticulos: number;
  private revisores: Array<Usuario>;
  private formaSeleccion: FormaSeleccionEnum;
  private numeroFiltro: number;

  public constructor(
    deadline: Date,
    maxArticulos: number,
    formaSeleccion: FormaSeleccionEnum
  ) {
    this.deadline = deadline;
    this.maxArticulos = maxArticulos;
    this.formaSeleccion = formaSeleccion;
    this.estado = TrackState.RECEPCION;
    this.articulos = [];
    this.revisores = [];
    this.numeroFiltro = 0;
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
        this.seleccionarArticulos();
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
          var potRev = this.revisores.find(
            (usr) => usr.getEmail() == bid.getRevisor().getEmail()
          );
          if (potRev === undefined) {
            throw Error("User mismatch");
          }
          const pos = this.revisores.findIndex((el) => el === potRev);
          const variance = pos < surplus;
          const numArticles = variance
            ? numArticlesPerReviewer + 1
            : numArticlesPerReviewer;
          if (potRev.getReviewLength() <= numArticles) {
            potRev.addReview(this.articulos[i].getTitulo());
            revisoresFinal.push(potRev);
          }
        }
      });
      if (revisoresFinal.length <= this.maxArticulos) {
        this.articulos[i].getBids().forEach((bid) => {
          if (
            bid.getInteres() == InteresState.QUIZAS &&
            revisoresFinal.length < this.maxArticulos
          ) {
            var potRev = this.revisores.find(
              (usr) => usr.getEmail() == bid.getRevisor().getEmail()
            );
            if (potRev === undefined) {
              throw Error("User mismatch");
            }
            const pos = this.revisores.findIndex((el) => el === potRev);
            const variance = pos < surplus;
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
      if (revisoresFinal.length <= this.maxArticulos) {
        const userFilter = this.articulos[i]
          .getBids()
          .map((el) => el.getRevisor().getEmail());
        const filteredUsers = this.revisores.filter((el) =>
          userFilter.includes(el.getEmail())
        );
        for (let j = 0; j < filteredUsers.length; j++) {
          if (revisoresFinal.length <= this.maxArticulos) {
            const pos = this.revisores.findIndex(
              (el) => el === filteredUsers[j]
            );
            const variance = pos < surplus;
            const numArticles = variance
              ? numArticlesPerReviewer + 1
              : numArticlesPerReviewer;
            if (filteredUsers[j].getReviewLength() <= numArticles) {
              filteredUsers[j].addReview(this.articulos[i].getTitulo());
              revisoresFinal.push(filteredUsers[j]);
            }
          }
        }
      }
      if (revisoresFinal.length <= this.maxArticulos) {
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
            const pos = this.revisores.findIndex((el) => el === potRev);
            const variance = pos < surplus;
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

  private seleccionarArticulos() {
    switch (this.formaSeleccion) {
      case FormaSeleccionEnum.CORTE_FIJO:
        this.filtrarCorteFijo();
        break;
      case FormaSeleccionEnum.MEJORES:
        this.filtrarMejores();
        break;
    }
  }

  private filtrarCorteFijo() {
    const articulosOrdenados = this.articulos.sort(
      (act, ant) => act.getPuntaje() - ant.getPuntaje()
    );
    const numeroDeAceptados = Math.round(
      (this.numeroFiltro * this.articulos.length) / 100
    );
    const articulosAceptados: Articulo[] = [];
    articulosOrdenados.forEach((art) => {
      if (articulosAceptados.length < numeroDeAceptados) {
        articulosAceptados.push(art);
      }
    });
    this.articulos = articulosAceptados;
  }

  private filtrarMejores() {
    const articulosOrdenados = this.articulos.sort(
      (act, ant) => act.getPuntaje() - ant.getPuntaje()
    );
    const articulosAceptados: Articulo[] = [];
    articulosOrdenados.forEach((art) => {
      if (art.getPuntaje() > this.numeroFiltro) {
        articulosAceptados.push(art);
      }
    });
    this.articulos = articulosAceptados;
  }

  public agregarArticulo(articulo: Articulo, day: Date = new Date()) {
    if (day > this.deadline) {
      throw new Error("No more articles are accepted at this stage");
    }
    const foundArticle = this.articulos.find(
      (art) => art.getTitulo() === articulo.getTitulo()
    );
    if (foundArticle) {
      this.articulos = this.articulos.filter((art) => art === foundArticle);
    }
    if (this.filtrarArticulo(articulo)) {
      articulo.setEstado(ArticuloState.RECIBIDO);
    } else {
      articulo.setEstado(ArticuloState.RECHAZADO);
    }
    this.articulos.push(articulo);
  }

  public setearPorcentaje(porcentaje: number) {
    this.numeroFiltro = porcentaje;
  }

  public editarArticulo(articulo: Articulo, day: Date = new Date()) {
    if (day > this.deadline) {
      throw new Error("You cannot edit this article anymore");
    }
    const foundArticle = this.articulos.find(
      (art) => art.getTitulo() === articulo.getTitulo()
    );
    if (foundArticle) {
      this.articulos = this.articulos.filter((art) => art === foundArticle);
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

  private filtrarArticulo(articulo: Articulo): boolean {
    var verify = this.verifyGeneric(articulo);
    if (articulo instanceof ArticuloRegular) {
      console.log("Es de tipo Articulo Regular");
      verify = verify && this.verifyRegular(articulo);
    } else {
      throw new Error("Tipo de articulo no valido");
    }
    return verify;
  }

  private verifyRegular(regular: ArticuloRegular): boolean {
    return ProjectUtils.getWordCount(regular.getAbstract()) > 300;
  }

  private verifyGeneric(poster: Articulo): boolean {
    return poster.getTitulo() != null && poster.getAuthors().length > 0;
  }
}

enum TrackState {
  RECEPCION = "Recepcion",
  BIDDING = "Bidding",
  ASIGNACION_REVISION = "Asignacion y Revision",
  SELECCION = "Seleccion",
}

enum FormaSeleccionEnum {
  CORTE_FIJO = "Corte Fijo",
  MEJORES = "Mejores",
}
