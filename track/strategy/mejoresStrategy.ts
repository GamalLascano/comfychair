import { Articulo } from "../../articles/articulo";
import { Strategy } from "./strategy";

export class MejoresStrategy implements Strategy {
  private puntaje: number;

  public constructor(puntaje: number) {
    this.puntaje = puntaje;
  }

  filter(articulos: Articulo[]): Articulo[] {
    const articulosOrdenados = articulos.sort(
      (act, ant) => act.getPuntaje() - ant.getPuntaje()
    );
    const articulosAceptados: Articulo[] = [];
    articulosOrdenados.forEach((art) => {
      if (art.getPuntaje() > this.puntaje) {
        articulosAceptados.push(art);
      }
    });
    return articulosAceptados;
  }
}
