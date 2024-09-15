import { Articulo } from "../../articles/articulo";

export interface Strategy {
  filter(articulos: Articulo[]): Articulo[];
}
