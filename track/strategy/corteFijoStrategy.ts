import { Articulo } from "../../articles/articulo";
import { Strategy } from "./strategy";

export class CorteFijoStrategy implements Strategy {
  private porcentaje: number;

  public constructor(porcentaje: number) {
    this.porcentaje = porcentaje;
  }

  filter(articulos: Articulo[]): Articulo[] {
    const articulosOrdenados = articulos.sort(
      (act, ant) => act.getPuntaje() - ant.getPuntaje()
    );
    const numeroDeAceptados = Math.round(
      (this.porcentaje * articulos.length) / 100
    );
    const articulosAceptados: Articulo[] = [];
    articulosOrdenados.forEach((art) => {
      if (articulosAceptados.length < numeroDeAceptados) {
        articulosAceptados.push(art);
      }
    });
    return articulosAceptados;
  }
}
