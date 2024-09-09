class Track {
  private articulos: Array<Articulo>;
  private deadline: Date;
  private estado: TrackState;
  private maxArticulos: Number;
  private revisores: Array<Usuario>;
  private formaSeleccion: FormaSeleccionEnum;

  public constructor(
    deadline: Date,
    maxArticulos: Number,
    formaSeleccion: FormaSeleccionEnum
  ) {
    this.deadline = deadline;
    this.maxArticulos = maxArticulos;
    this.formaSeleccion = formaSeleccion;
    this.estado = TrackState.RECEPCION;
    this.articulos = [];
    this.revisores = [];
  }

  public avanzarEstado(): void {
    switch (this.estado) {
      case TrackState.RECEPCION:
        this.estado = TrackState.BIDDING;
        this.ordenarArticulos();
        break;
      case TrackState.BIDDING:
        this.estado = TrackState.ASIGNACION_REVISION;
        break;
      case TrackState.ASIGNACION_REVISION:
        this.estado = TrackState.SELECCION;
        break;
      case TrackState.SELECCION:
        console.log("Ya se llego al ultimo estado");
        break;
    }
  }

  private divideArticles(){
    const numArticlesPerReviewer = this.calculateArticlesPerReviewer()
    const surplus = this.calculateSurplus()
  }

  private calculateArticlesPerReviewer(){
    return Math.floor((3*this.articulos.length)/this.revisores.length)
  }

  private calculateSurplus(){
    return (3*this.articulos.length)%this.revisores.length
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

  public agregarArticulo(articulo: Articulo, day: Date = new Date()) {
    if (day > this.deadline) {
      throw new Error("No more articles are accepted at this stage");
    }
    const foundArticle = this.articulos.find(
      (art) => art.getTitulo() === articulo.getTitulo()
    );
    if (foundArticle) {
      //Remove article from articulos array
      this.articulos = this.articulos.filter((art) => art === foundArticle);
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

  public getArticulos(){
    return this.articulos
  }

  public makeBid(user: Usuario, articulo: Articulo, interes: InteresState){
    const index = this.articulos.findIndex((el)=>el === articulo)
    this.articulos[index].makeBid(user, interes)
  }

  public modifyBid(user: Usuario, articulo: Articulo, interes: InteresState){
    const index = this.articulos.findIndex((el)=>el === articulo)
    this.articulos[index].modifyBid(user, interes)
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
